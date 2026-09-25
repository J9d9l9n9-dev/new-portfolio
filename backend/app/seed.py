import os
import sys
import json
from app.database import SessionLocal, engine, Base
from app.models import (
    Profile, SiteSettings, Skill, LearningItem, JourneyMilestone,
    Certification, Achievement, Experience, Education, Project, AdminUser
)
from app.auth import get_password_hash
from app.config import settings

def seed_database(force: bool = True):
    """
    Idempotent database seeding.
    Always resets/recreates portfolio tables when force=True and seeds
    verified authentic content directly from backend/seed/content.json.
    """
    if force:
        try:
            Base.metadata.drop_all(bind=engine)
        except Exception as drop_err:
            print(f"Notice on dropping tables: {drop_err}")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 2. Check content.json path
        seed_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "seed", "content.json")
        if not os.path.exists(seed_path):
            print(f"No seed file found at {seed_path}")
            return

        with open(seed_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # 2.1 Admin Owner setup: created ONLY from env variables
        if settings.ADMIN_EMAIL and settings.ADMIN_PASSWORD:
            existing_admin = db.query(AdminUser).filter(AdminUser.email == settings.ADMIN_EMAIL).first()
            if not existing_admin:
                admin = AdminUser(
                    email=settings.ADMIN_EMAIL,
                    hashed_password=get_password_hash(settings.ADMIN_PASSWORD)
                )
                db.add(admin)
                db.commit()
                print(f"Created admin user for: {settings.ADMIN_EMAIL}")
            else:
                existing_admin.hashed_password = get_password_hash(settings.ADMIN_PASSWORD)
                db.commit()

        # 3. Seed Profile
        profile_data = data.get("profile")
        if profile_data:
            existing_profile = db.query(Profile).first()
            if not existing_profile:
                profile = Profile(
                    name=profile_data["name"],
                    short_name=profile_data.get("shortName", "Lakshmi Narayana"),
                    initials=profile_data.get("initials", "JDLN"),
                    role=profile_data.get("roles", profile_data.get("role", ["Full-Stack Developer"])),
                    roles=profile_data.get("roles", ["Full-Stack Developer"]),
                    tagline=profile_data["tagline"],
                    bio=profile_data["bio"],
                    location=profile_data["location"],
                    email=profile_data["email"],
                    resume_url=profile_data.get("resumeUrl", "/resume.pdf"),
                    hero_image=profile_data.get("heroImage", "/images/hero.jpg"),
                    hero_image_position=profile_data.get("heroImagePosition", "center 20%"),
                    availability=profile_data.get("availability", "Open to opportunities"),
                    open_to_work=profile_data.get("openToWork", True),
                    socials=profile_data["socials"],
                    stats=profile_data.get("stats", [
                        {"label": "Featured Projects", "value": 3},
                        {"label": "Hackathons", "value": 1},
                        {"label": "Technologies", "value": 52}
                    ])
                )
                db.add(profile)

        # 4. Seed Site Settings
        settings_data = data.get("settings", {})
        existing_settings = db.query(SiteSettings).first()
        if not existing_settings:
            site_settings = SiteSettings(
                open_to_work=settings_data.get("open_to_work", True),
                work_status_text=settings_data.get("work_status_text", profile_data.get("availability", "Open to opportunities")),
                resume_url=settings_data.get("resume_url", "/resume.pdf"),
                theme_default=settings_data.get("theme_default", "dark"),
                contact_email=settings_data.get("contact_email", profile_data.get("email", "jampadurgalakshminarayana@gmail.com"))
            )
            db.add(site_settings)

        # 5. Seed Skills
        if db.query(Skill).count() == 0 and "skills" in data:
            for idx, s in enumerate(data["skills"]):
                db.add(Skill(
                    category=s["category"],
                    items=s.get("items") or [],
                    chips=s.get("chips") or [],
                    order=s.get("order", idx),
                    is_published=True
                ))

        # 6. Seed Learning Items
        currently_learning = data.get("currentlyLearning", data.get("learning_items", []))
        if db.query(LearningItem).count() == 0 and currently_learning:
            for idx, item in enumerate(currently_learning):
                name = item if isinstance(item, str) else item.get("name", "")
                db.add(LearningItem(
                    name=name,
                    category="Currently Learning",
                    status="Active",
                    order=idx,
                    is_published=True
                ))

        # 7. Seed Journey Milestones
        journey_list = data.get("journey", data.get("journey_milestones", []))
        if db.query(JourneyMilestone).count() == 0 and journey_list:
            for idx, j in enumerate(journey_list):
                db.add(JourneyMilestone(
                    year=j["year"],
                    title=j["title"],
                    description=j["description"],
                    tag=j.get("tag", "Milestone"),
                    order=j.get("order", idx),
                    is_published=True
                ))

        # 8. Seed Certifications
        if db.query(Certification).count() == 0 and "certifications" in data:
            for idx, c in enumerate(data["certifications"]):
                db.add(Certification(
                    title=c["title"],
                    issuer=c.get("issuer", ""),
                    date=c.get("date", ""),
                    credential_url=c.get("credential_url", ""),
                    badge_image=c.get("badge_image", ""),
                    order=c.get("order", idx),
                    is_published=True
                ))

        # 9. Seed Achievements
        if db.query(Achievement).count() == 0 and "achievements" in data:
            for idx, a in enumerate(data["achievements"]):
                db.add(Achievement(
                    title=a["title"],
                    organization=a.get("organization", "Smart India Hackathon (SIH)"),
                    description=a["description"],
                    date=a.get("date", "2025"),
                    url=a.get("url") or a.get("link") or None,
                    badge=a.get("badge", "Hackathon"),
                    order=a.get("order", idx),
                    is_published=True
                ))

        # 10. Seed Experience (Project Experience)
        if db.query(Experience).count() == 0 and "experience" in data:
            for idx, exp in enumerate(data["experience"]):
                db.add(Experience(
                    company=exp.get("company") or exp.get("organization") or exp.get("role") or "Project Development",
                    title=exp["title"],
                    role=exp.get("role"),
                    type=exp.get("type", "project"),
                    period=exp["period"],
                    points=exp["points"],
                    order=exp.get("order", idx),
                    is_published=True
                ))

        # 11. Seed Education
        if db.query(Education).count() == 0 and "education" in data:
            for idx, edu in enumerate(data["education"]):
                db.add(Education(
                    school=edu.get("school", edu.get("institution", "")),
                    degree=edu["degree"],
                    period=edu["period"],
                    order=edu.get("order", idx),
                    is_published=True
                ))

        # 12. Seed Projects
        if db.query(Project).count() == 0 and "projects" in data:
            for idx, p in enumerate(data["projects"]):
                db.add(Project(
                    slug=p["slug"],
                    title=p["title"],
                    summary=p["summary"],
                    problem=p["problem"],
                    solution=p["solution"],
                    features=p["features"],
                    architecture=p.get("architecture", ""),
                    learnings=p.get("learnings", ""),
                    tech=p["tech"],
                    category=p["category"],
                    status=p.get("status", ""),
                    image=p.get("image") or "",
                    gallery=p.get("gallery", []),
                    live=p.get("live"),
                    repo=p.get("repo"),
                    featured=p.get("featured", True),
                    order=p.get("order", idx),
                    is_published=p.get("is_published", True)
                ))

        db.commit()
        print("Database seeding completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    force_flag = "--no-force" not in sys.argv
    seed_database(force=force_flag)
