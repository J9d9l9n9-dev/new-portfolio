from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Skill, LearningItem, AdminUser
from app.schemas import (
    SkillOut, SkillCreate, SkillUpdate,
    LearningItemOut, LearningItemCreate, LearningItemUpdate
)
from app.auth import get_current_admin

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[SkillOut])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).filter(Skill.is_published == True).order_by(Skill.order.asc(), Skill.id.asc()).all()

@router.get("/admin/all", response_model=List[SkillOut])
def get_all_skills_admin(db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    return db.query(Skill).order_by(Skill.order.asc(), Skill.id.asc()).all()

@router.post("", response_model=SkillOut, status_code=status.HTTP_201_CREATED)
def create_skill(
    skill_in: SkillCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    skill = Skill(**skill_in.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill

@router.put("/{skill_id}", response_model=SkillOut)
def update_skill(
    skill_id: int,
    skill_in: SkillUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    update_data = skill_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(skill, key, value)
    db.commit()
    db.refresh(skill)
    return skill

@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    db.delete(skill)
    db.commit()
    return None

# Learning Items
@router.get("/learning/items", response_model=List[LearningItemOut])
def get_learning_items(db: Session = Depends(get_db)):
    return db.query(LearningItem).filter(LearningItem.is_published == True).order_by(LearningItem.order.asc()).all()

@router.post("/learning/items", response_model=LearningItemOut, status_code=status.HTTP_201_CREATED)
def create_learning_item(
    item_in: LearningItemCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    item = LearningItem(**item_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/learning/items/{item_id}", response_model=LearningItemOut)
def update_learning_item(
    item_id: int,
    item_in: LearningItemUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    item = db.query(LearningItem).filter(LearningItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Learning item not found")
    update_data = item_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/learning/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_learning_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    item = db.query(LearningItem).filter(LearningItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Learning item not found")
    db.delete(item)
    db.commit()
    return None
