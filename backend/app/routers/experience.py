from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Experience, AdminUser
from app.schemas import ExperienceOut, ExperienceCreate, ExperienceUpdate
from app.auth import get_current_admin

router = APIRouter(prefix="/experience", tags=["Experience"])

@router.get("", response_model=List[ExperienceOut])
def get_experience(db: Session = Depends(get_db)):
    return db.query(Experience).order_by(Experience.order.asc(), Experience.id.asc()).all()

@router.post("", response_model=ExperienceOut, status_code=status.HTTP_201_CREATED)
def create_experience(
    exp_in: ExperienceCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    exp = Experience(**exp_in.model_dump())
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp

@router.put("/{exp_id}", response_model=ExperienceOut)
def update_experience(
    exp_id: int,
    exp_in: ExperienceUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experience record not found")
    update_data = exp_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(exp, key, value)
    db.commit()
    db.refresh(exp)
    return exp

@router.delete("/{exp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(
    exp_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experience record not found")
    db.delete(exp)
    db.commit()
    return None
