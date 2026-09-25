from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import JourneyMilestone, AdminUser
from app.schemas import JourneyMilestoneOut, JourneyMilestoneCreate, JourneyMilestoneUpdate
from app.auth import get_current_admin

router = APIRouter(prefix="/journey", tags=["Journey Milestones"])

@router.get("", response_model=List[JourneyMilestoneOut])
def get_journey_milestones(db: Session = Depends(get_db)):
    return db.query(JourneyMilestone).filter(JourneyMilestone.is_published == True).order_by(JourneyMilestone.order.asc(), JourneyMilestone.year.asc()).all()

@router.get("/all", response_model=List[JourneyMilestoneOut])
def get_all_journey_milestones(db: Session = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return db.query(JourneyMilestone).order_by(JourneyMilestone.order.asc(), JourneyMilestone.year.asc()).all()

@router.post("", response_model=JourneyMilestoneOut, status_code=status.HTTP_201_CREATED)
def create_journey_milestone(
    milestone_in: JourneyMilestoneCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    milestone = JourneyMilestone(**milestone_in.model_dump())
    db.add(milestone)
    db.commit()
    db.refresh(milestone)
    return milestone

@router.put("/{milestone_id}", response_model=JourneyMilestoneOut)
def update_journey_milestone(
    milestone_id: int,
    milestone_in: JourneyMilestoneUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    milestone = db.query(JourneyMilestone).filter(JourneyMilestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    update_data = milestone_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(milestone, key, value)
    
    db.commit()
    db.refresh(milestone)
    return milestone

@router.delete("/{milestone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_journey_milestone(
    milestone_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    milestone = db.query(JourneyMilestone).filter(JourneyMilestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    db.delete(milestone)
    db.commit()
    return None
