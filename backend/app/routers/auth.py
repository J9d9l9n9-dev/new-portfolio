import datetime
from datetime import timedelta
import jwt
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AdminUser
from app.schemas import Token, AdminLogin, RefreshTokenRequest
from app.auth import verify_password, create_access_token, create_refresh_token, get_current_admin, utcnow
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Per-IP plus per-account progressive delay lockout tracking with TTL
# Key: (client_ip, email) -> {"count": int, "locked_until": Optional[datetime], "last_attempt": datetime}
ip_account_attempts: dict = {}
LOCKOUT_ENTRY_TTL = timedelta(hours=1)
MAX_LOCKOUT_ENTRIES = 5000

def reset_lockout_state():
    """Reset all in-memory lockout attempts (used in testing and admin resets)."""
    ip_account_attempts.clear()

def prune_expired_attempts(now: datetime.datetime):
    """Prune expired lockout entries to avoid memory growth in long-running instances."""
    expired_keys = []
    for key, info in ip_account_attempts.items():
        last = info.get("last_attempt", now)
        if last.tzinfo is None:
            last = last.replace(tzinfo=datetime.timezone.utc)
        locked_until = info.get("locked_until")
        if locked_until and locked_until.tzinfo is None:
            locked_until = locked_until.replace(tzinfo=datetime.timezone.utc)
        # Expired if last attempt was longer ago than TTL and not currently locked
        if (now - last > LOCKOUT_ENTRY_TTL) and (locked_until is None or now > locked_until):
            expired_keys.append(key)
    for k in expired_keys:
        ip_account_attempts.pop(k, None)

    # If still too large, prune oldest entries
    if len(ip_account_attempts) > MAX_LOCKOUT_ENTRIES:
        sorted_keys = sorted(
            ip_account_attempts.keys(),
            key=lambda k: ip_account_attempts[k].get("last_attempt", now)
        )
        for k in sorted_keys[:len(ip_account_attempts) - MAX_LOCKOUT_ENTRIES]:
            ip_account_attempts.pop(k, None)

def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"

def check_ip_account_lockout(request: Request, email: str):
    client_ip = get_client_ip(request)
    now = utcnow()
    prune_expired_attempts(now)
    key = (client_ip, email.lower().strip())
    attempt_info = ip_account_attempts.get(key)
    
    if attempt_info and attempt_info.get("locked_until"):
        locked_time = attempt_info["locked_until"]
        if locked_time.tzinfo is None:
            locked_time = locked_time.replace(tzinfo=datetime.timezone.utc)
        if locked_time > now:
            seconds_left = max(1, int((locked_time - now).total_seconds()))
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Account locked due to too many failed login attempts. Try again in {seconds_left} seconds."
            )
        else:
            attempt_info["locked_until"] = None

def register_failed_attempt(request: Request, email: str):
    client_ip = get_client_ip(request)
    now = utcnow()
    prune_expired_attempts(now)
    key = (client_ip, email.lower().strip())
    
    if key not in ip_account_attempts:
        ip_account_attempts[key] = {"count": 0, "locked_until": None, "last_attempt": now}
    
    ip_account_attempts[key]["count"] += 1
    ip_account_attempts[key]["last_attempt"] = now
    count = ip_account_attempts[key]["count"]
    
    # Progressive delay schedule
    if count >= 8:
        delay_seconds = 900  # 15 minutes
    elif count >= 6:
        delay_seconds = 300  # 5 minutes
    elif count >= 5:
        delay_seconds = 60   # 1 minute
    elif count >= 3:
        delay_seconds = 10   # 10 seconds
    else:
        delay_seconds = 0
        
    if delay_seconds > 0:
        ip_account_attempts[key]["locked_until"] = now + timedelta(seconds=delay_seconds)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Account locked due to too many failed login attempts. Please wait {delay_seconds} seconds before trying again."
        )

def register_successful_attempt(request: Request, email: str):
    client_ip = get_client_ip(request)
    key = (client_ip, email.lower().strip())
    if key in ip_account_attempts:
        del ip_account_attempts[key]

@router.post("/login", response_model=Token)
def login(request: Request, response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email = form_data.username.lower().strip()
    check_ip_account_lockout(request, email)

    admin = db.query(AdminUser).filter(AdminUser.email == email).first()
    if not admin:
        register_failed_attempt(request, email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(form_data.password, admin.hashed_password):
        register_failed_attempt(request, email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Success: reset failed attempts for this IP and account
    register_successful_attempt(request, email)

    access_token = create_access_token(data={"sub": admin.email})
    refresh_token = create_refresh_token(data={"sub": admin.email})

    # Set httpOnly secure refresh cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.post("/login-json", response_model=Token)
def login_json(request: Request, response: Response, credentials: AdminLogin, db: Session = Depends(get_db)):
    email = credentials.email.lower().strip()
    check_ip_account_lockout(request, email)

    admin = db.query(AdminUser).filter(AdminUser.email == email).first()
    if not admin:
        register_failed_attempt(request, email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(credentials.password, admin.hashed_password):
        register_failed_attempt(request, email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Success: reset failed attempts
    register_successful_attempt(request, email)

    access_token = create_access_token(data={"sub": admin.email})
    refresh_token = create_refresh_token(data={"sub": admin.email})

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.post("/refresh", response_model=Token)
def refresh_token(request: Request, response: Response, body: RefreshTokenRequest = None, db: Session = Depends(get_db)):
    token = None
    if body and body.refresh_token:
        token = body.refresh_token
    elif "refresh_token" in request.cookies:
        token = request.cookies.get("refresh_token")
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing refresh token"
        )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if email is None or token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Expired or invalid refresh token"
        )
    
    admin = db.query(AdminUser).filter(AdminUser.email == email).first()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    new_access_token = create_access_token(data={"sub": admin.email})
    new_refresh_token = create_refresh_token(data={"sub": admin.email})

    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400
    )

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="refresh_token")
    return {"message": "Successfully logged out"}

@router.get("/me")
def get_me(current_admin: AdminUser = Depends(get_current_admin)):
    return {
        "email": current_admin.email,
        "authenticated": True,
        "created_at": current_admin.created_at
    }
