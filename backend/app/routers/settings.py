from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import (
    SiteSettings, Profile, Skill, Experience, Education,
    Project, JourneyMilestone, Certification, Achievement, AdminUser
)
from app.schemas import SiteSettingsOut, SiteSettingsUpdate
from app.auth import get_current_admin

router = APIRouter(tags=["Site Settings & Backup"])

@router.get("/settings", response_model=SiteSettingsOut)
def get_site_settings(db: Session = Depends(get_db)):
    settings_obj = db.query(SiteSettings).first()
    if not settings_obj:
        settings_obj = SiteSettings(
            open_to_work=True,
            work_status_text="Open to Summer 2026 Internships & Roles",
            resume_url="/resume.pdf",
            theme_default="dark",
            contact_email="student@example.edu"
        )
        db.add(settings_obj)
        db.commit()
        db.refresh(settings_obj)
    return settings_obj

@router.put("/settings", response_model=SiteSettingsOut)
def update_site_settings(
    settings_in: SiteSettingsUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    settings_obj = db.query(SiteSettings).first()
    if not settings_obj:
        settings_obj = SiteSettings()
        db.add(settings_obj)
    
    update_data = settings_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings_obj, key, value)
    
    db.commit()
    db.refresh(settings_obj)
    return settings_obj

@router.get("/backup/export")
def export_backup_json(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    profile = db.query(Profile).first()
    skills = db.query(Skill).all()
    experience = db.query(Experience).all()
    education = db.query(Education).all()
    projects = db.query(Project).all()
    journey = db.query(JourneyMilestone).all()
    certifications = db.query(Certification).all()
    achievements = db.query(Achievement).all()
    settings_obj = db.query(SiteSettings).first()

    backup_data = {
        "profile": {
            "name": profile.name if profile else "",
            "role": profile.role if profile else [],
            "tagline": profile.tagline if profile else "",
            "bio": profile.bio if profile else "",
            "location": profile.location if profile else "",
            "email": profile.email if profile else "",
            "resumeUrl": profile.resume_url if profile else "/resume.pdf",
            "heroImage": profile.hero_image if profile else "/images/hero.jpg",
            "heroImagePosition": profile.hero_image_position if profile else "center 20%",
            "availability": profile.availability if profile else "",
            "socials": profile.socials if profile else {},
            "stats": profile.stats if profile else []
        },
        "settings": {
            "open_to_work": settings_obj.open_to_work if settings_obj else True,
            "work_status_text": settings_obj.work_status_text if settings_obj else "",
            "resume_url": settings_obj.resume_url if settings_obj else "/resume.pdf",
            "theme_default": settings_obj.theme_default if settings_obj else "dark",
            "contact_email": settings_obj.contact_email if settings_obj else ""
        },
        "skills": [{"id": s.id, "category": s.category, "items": s.items, "order": s.order} for s in skills],
        "experience": [{"id": e.id, "company": e.company, "title": e.title, "period": e.period, "points": e.points, "order": e.order} for e in experience],
        "education": [{"id": ed.id, "school": ed.school, "degree": ed.degree, "period": ed.period, "order": ed.order} for ed in education],
        "projects": [{
            "slug": p.slug,
            "title": p.title,
            "summary": p.summary,
            "problem": p.problem,
            "solution": p.solution,
            "features": p.features,
            "architecture": p.architecture,
            "learnings": p.learnings,
            "tech": p.tech,
            "category": p.category,
            "image": p.image,
            "gallery": p.gallery,
            "live": p.live,
            "repo": p.repo,
            "featured": p.featured,
            "order": p.order,
            "is_published": p.is_published
        } for p in projects],
        "journey": [{
            "id": j.id,
            "year": j.year,
            "title": j.title,
            "description": j.description,
            "tag": j.tag,
            "order": j.order
        } for j in journey],
        "certifications": [{
            "id": c.id,
            "title": c.title,
            "issuer": c.issuer,
            "date": c.date,
            "credential_url": c.credential_url,
            "badge_image": c.badge_image,
            "order": c.order
        } for c in certifications],
        "achievements": [{
            "id": a.id,
            "title": a.title,
            "organization": a.organization,
            "description": a.description,
            "date": a.date,
            "url": a.url,
            "badge": a.badge,
            "order": a.order
        } for a in achievements]
    }
    return JSONResponse(
        content=backup_data,
        headers={"Content-Disposition": "attachment; filename=portfolio_backup.json"}
    )
