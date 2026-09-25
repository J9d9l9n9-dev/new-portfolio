from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Achievement, AdminUser
from app.schemas import AchievementOut, AchievementCreate, AchievementUpdate
from app.auth import get_current_admin

router = APIRouter(prefix="/achievements", tags=["Achievements"])

@router.get("", response_model=List[AchievementOut])
def get_achievements(db: Session = Depends(get_db)):
    return db.query(Achievement).filter(Achievement.is_published == True).order_by(Achievement.order.asc()).all()

@router.get("/all", response_model=List[AchievementOut])
def get_all_achievements(db: Session = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return db.query(Achievement).order_by(Achievement.order.asc()).all()

@router.post("", response_model=AchievementOut, status_code=status.HTTP_201_CREATED)
def create_achievement(
    achievement_in: AchievementCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    achievement = Achievement(**achievement_in.model_dump())
    db.add(achievement)
    db.commit()
    db.refresh(achievement)
    return achievement

@router.put("/{achievement_id}", response_model=AchievementOut)
def update_achievement(
    achievement_id: int,
    achievement_in: AchievementUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    update_data = achievement_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(achievement, key, value)
    
    db.commit()
    db.refresh(achievement)
    return achievement

@router.delete("/{achievement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_achievement(
    achievement_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    db.delete(achievement)
    db.commit()
    return None
