import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ContactMessage, AdminUser
from app.schemas import ContactMessageCreate, ContactMessageOut
from app.auth import get_current_admin, utcnow
from app.config import settings

router = APIRouter(prefix="/contact", tags=["Contact"])

SUBMISSION_HISTORY: Dict[str, List[datetime.datetime]] = {}

def check_rate_limit(client_ip: str):
    now = utcnow()
    window = datetime.timedelta(minutes=settings.CONTACT_RATE_LIMIT_MINUTES)
    
    if client_ip not in SUBMISSION_HISTORY:
        SUBMISSION_HISTORY[client_ip] = []
        
    SUBMISSION_HISTORY[client_ip] = [
        t for t in SUBMISSION_HISTORY[client_ip] if now - t < window
    ]
    
    if len(SUBMISSION_HISTORY[client_ip]) >= settings.CONTACT_RATE_LIMIT_MAX:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Please wait {settings.CONTACT_RATE_LIMIT_MINUTES} minutes before submitting another message."
        )
    
    SUBMISSION_HISTORY[client_ip].append(now)

def send_optional_email(msg: ContactMessage):
    if not (settings.SMTP_HOST and settings.SMTP_USER and settings.NOTIFY_EMAIL):
        return
    try:
        email_message = MIMEMultipart()
        email_message["From"] = settings.SMTP_USER
        email_message["To"] = settings.NOTIFY_EMAIL
        email_message["Subject"] = f"[Portfolio Contact] {msg.subject} from {msg.name}"
        body = f"Sender: {msg.name} ({msg.email})\nSubject: {msg.subject}\n\nMessage:\n{msg.message}"
        email_message.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(email_message)
    except Exception as e:
        print(f"Warning: Failed to send SMTP notification: {e}")

@router.post("", response_model=ContactMessageOut, status_code=status.HTTP_201_CREATED)
def submit_contact_message(
    message_in: ContactMessageCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    # Honeypot spam detection: return synthetic success without storing
    if message_in.honeypot and message_in.honeypot.strip():
        return ContactMessage(
            id=999999,
            name=message_in.name,
            email=message_in.email,
            subject=message_in.subject,
            message=message_in.message,
            created_at=utcnow(),
            is_read=True,
            is_handled=True
        )

    client_ip = request.client.host if request.client else "unknown"
    check_rate_limit(client_ip)

    db_message = ContactMessage(
        name=message_in.name,
        email=message_in.email,
        subject=message_in.subject,
        message=message_in.message,
        is_read=False,
        is_handled=False
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    send_optional_email(db_message)
    return db_message

@router.get("", response_model=List[ContactMessageOut])
def get_contact_messages(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()

@router.patch("/{message_id}/read", response_model=ContactMessageOut)
def mark_message_as_read(
    message_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    msg.is_read = True
    db.commit()
    db.refresh(msg)
    return msg

@router.patch("/{message_id}/handle", response_model=ContactMessageOut)
def toggle_message_handled(
    message_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    msg.is_handled = not msg.is_handled
    msg.is_read = True
    db.commit()
    db.refresh(msg)
    return msg

@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    db.delete(msg)
    db.commit()
    return None
