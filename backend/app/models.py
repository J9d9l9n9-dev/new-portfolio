import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from app.database import Base

def utcnow():
    return datetime.datetime.now(datetime.timezone.utc)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    short_name = Column(String(100), default="Lakshmi Narayana")
    initials = Column(String(20), default="JDLN")
    role = Column(JSON, nullable=False)  # List[str]
    roles = Column(JSON, nullable=True)  # List[str]
    tagline = Column(String(255), nullable=False)
    bio = Column(Text, nullable=False)
    location = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    resume_url = Column(String(255), nullable=False)
    hero_image = Column(String(255), nullable=False)
    hero_image_position = Column(String(50), default="center 20%")
    availability = Column(String(150), default="Open to internships, hackathons, research opportunities, and software development opportunities")
    open_to_work = Column(Boolean, default=True)
    socials = Column(JSON, nullable=False)  # {"github": "...", "linkedin": "..."}
    stats = Column(JSON, nullable=False)    # [{"label": "...", "value": 3}]
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    open_to_work = Column(Boolean, default=True)
    work_status_text = Column(String(150), default="Open to internships, hackathons, research opportunities, and software development opportunities")
    resume_url = Column(String(255), default="/resume.pdf")
    theme_default = Column(String(20), default="dark")
    contact_email = Column(String(100), default="jampadurgalakshminarayana@gmail.com")
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

class SocialLink(Base):
    __tablename__ = "social_links"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String(50), nullable=False)
    url = Column(String(255), nullable=False)
    icon = Column(String(50), nullable=False)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False)
    items = Column(JSON, nullable=True)  # List[{"name": "...", "level": "Intermediate"}]
    chips = Column(JSON, nullable=True)  # List[str]
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class LearningItem(Base):
    __tablename__ = "learning_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), default="AI & Systems")
    status = Column(String(50), default="Active")
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class JourneyMilestone(Base):
    __tablename__ = "journey_milestones"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(String(20), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    tag = Column(String(50), default="Milestone")
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class Experience(Base):
    __tablename__ = "experience"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(150), nullable=True)
    title = Column(String(150), nullable=False)
    role = Column(String(150), nullable=True)
    type = Column(String(50), default="project")
    period = Column(String(100), nullable=False)
    points = Column(JSON, nullable=False)  # List[str]
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    school = Column(String(150), nullable=False)
    degree = Column(String(150), nullable=False)
    period = Column(String(100), nullable=False)
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(150), nullable=False)
    summary = Column(Text, nullable=False)
    problem = Column(Text, nullable=False)
    solution = Column(Text, nullable=False)
    features = Column(JSON, nullable=False)       # List[str]
    architecture = Column(Text, default="")
    learnings = Column(Text, default="")
    tech = Column(JSON, nullable=False)           # List[str]
    category = Column(String(50), nullable=False)
    status = Column(String(100), default="")
    image = Column(String(255), nullable=True, default="")
    gallery = Column(JSON, default=list)          # List[str] of screenshot URLs
    live = Column(String(255), nullable=True, default=None)
    repo = Column(String(255), nullable=True, default=None)
    featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    issuer = Column(String(100), nullable=False)
    date = Column(String(50), nullable=False)
    credential_url = Column(String(255), default="")
    badge_image = Column(String(255), default="")
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    organization = Column(String(100), nullable=True, default="")
    description = Column(Text, nullable=False)
    date = Column(String(50), nullable=True, default="")
    url = Column(String(255), nullable=True, default=None)
    badge = Column(String(50), default="Hackathon")
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utcnow)
    is_read = Column(Boolean, default=False)
    is_handled = Column(Boolean, default=False)

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utcnow)
