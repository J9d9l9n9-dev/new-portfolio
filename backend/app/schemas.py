from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# Profile Schemas
class ProfileBase(BaseModel):
    name: str
    short_name: Optional[str] = "Lakshmi Narayana"
    initials: Optional[str] = "JDLN"
    role: List[str]
    roles: Optional[List[str]] = None
    tagline: str
    bio: str
    location: str
    email: EmailStr
    resume_url: str
    hero_image: str
    hero_image_position: Optional[str] = "center 20%"
    availability: Optional[str] = "Open to internships, hackathons, research opportunities, and software development opportunities"
    open_to_work: Optional[bool] = True
    socials: Dict[str, str]
    stats: List[Dict[str, Any]]

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    short_name: Optional[str] = None
    initials: Optional[str] = None
    role: Optional[List[str]] = None
    roles: Optional[List[str]] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    email: Optional[EmailStr] = None
    resume_url: Optional[str] = None
    hero_image: Optional[str] = None
    hero_image_position: Optional[str] = None
    availability: Optional[str] = None
    open_to_work: Optional[bool] = None
    socials: Optional[Dict[str, str]] = None
    stats: Optional[List[Dict[str, Any]]] = None

class ProfileOut(ProfileBase):
    id: int
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# Site Settings Schemas
class SiteSettingsBase(BaseModel):
    open_to_work: bool = True
    work_status_text: str = "Open to internships, hackathons, research opportunities, and software development opportunities"
    resume_url: str = "/resume.pdf"
    theme_default: str = "dark"
    contact_email: str = "jampadurgalakshminarayana@gmail.com"

class SiteSettingsUpdate(BaseModel):
    open_to_work: Optional[bool] = None
    work_status_text: Optional[str] = None
    resume_url: Optional[str] = None
    theme_default: Optional[str] = None
    contact_email: Optional[str] = None

class SiteSettingsOut(SiteSettingsBase):
    id: int
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# Social Link Schemas
class SocialLinkBase(BaseModel):
    platform: str
    url: str
    icon: str
    order: Optional[int] = 0
    is_active: Optional[bool] = True

class SocialLinkCreate(SocialLinkBase):
    pass

class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class SocialLinkOut(SocialLinkBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Skills Schemas
class SkillBase(BaseModel):
    category: str
    items: Optional[List[Any]] = []
    chips: Optional[List[str]] = []
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    category: Optional[str] = None
    items: Optional[List[Any]] = None
    chips: Optional[List[str]] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None

class SkillOut(SkillBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Learning Item Schemas
class LearningItemBase(BaseModel):
    name: str
    category: Optional[str] = "Backend & Systems"
    status: Optional[str] = "Exploring"
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class LearningItemCreate(LearningItemBase):
    pass

class LearningItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None

class LearningItemOut(LearningItemBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Journey Milestone Schemas
class JourneyMilestoneBase(BaseModel):
    year: str
    title: str
    description: str
    tag: Optional[str] = "Milestone"
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class JourneyMilestoneCreate(JourneyMilestoneBase):
    pass

class JourneyMilestoneUpdate(BaseModel):
    year: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    tag: Optional[str] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None

class JourneyMilestoneOut(JourneyMilestoneBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Experience Schemas
class ExperienceBase(BaseModel):
    company: str
    title: str
    role: Optional[str] = None
    type: Optional[str] = "project"
    period: str
    points: List[str]
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    title: Optional[str] = None
    role: Optional[str] = None
    type: Optional[str] = None
    period: Optional[str] = None
    points: Optional[List[str]] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None

class ExperienceOut(ExperienceBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Education Schemas
class EducationBase(BaseModel):
    school: str
    degree: str
    period: str
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class EducationCreate(EducationBase):
    pass

class EducationUpdate(BaseModel):
    school: Optional[str] = None
    degree: Optional[str] = None
    period: Optional[str] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None

class EducationOut(EducationBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Project Schemas
class ProjectBase(BaseModel):
    slug: str
    title: str
    summary: str
    problem: str
    solution: str
    features: List[str]
    architecture: Optional[str] = ""
    learnings: Optional[str] = ""
    tech: List[str]
    category: str
    status: Optional[str] = ""
    image: Optional[str] = ""
    gallery: Optional[List[str]] = []
    live: Optional[str] = None
    repo: Optional[str] = None
    featured: Optional[bool] = False
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    summary: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    features: Optional[List[str]] = None
    architecture: Optional[str] = None
    learnings: Optional[str] = None
    tech: Optional[List[str]] = None
    category: Optional[str] = None
    status: Optional[str] = None
    image: Optional[str] = None
    gallery: Optional[List[str]] = None
    live: Optional[str] = None
    repo: Optional[str] = None
    featured: Optional[bool] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None

class ProjectOut(ProjectBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Certification Schemas
class CertificationBase(BaseModel):
    title: str
    issuer: str
    date: str
    credential_url: Optional[str] = ""
    badge_image: Optional[str] = ""
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class CertificationCreate(CertificationBase):
    pass

class CertificationUpdate(BaseModel):
    title: Optional[str] = None
    issuer: Optional[str] = None
    date: Optional[str] = None
    credential_url: Optional[str] = None
    badge_image: Optional[str] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None

class CertificationOut(CertificationBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Achievement Schemas
class AchievementBase(BaseModel):
    title: str
    organization: Optional[str] = ""
    description: str
    date: Optional[str] = ""
    url: Optional[str] = None
    badge: Optional[str] = "Hackathon"
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class AchievementCreate(AchievementBase):
    pass

class AchievementUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    url: Optional[str] = None
    badge: Optional[str] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None

class AchievementOut(AchievementBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Contact Message Schemas
class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=3, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)
    honeypot: Optional[str] = None

class ContactMessageOut(BaseModel):
    id: int
    name: str
    email: str
    subject: str
    message: str
    created_at: datetime
    is_read: bool
    is_handled: bool

    model_config = ConfigDict(from_attributes=True)

# Auth Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int = 1800  # 30 minutes in seconds

class TokenData(BaseModel):
    username: Optional[str] = None

class AdminLogin(BaseModel):
    email: str
    password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: Optional[str] = None
