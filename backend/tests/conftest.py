import os
import secrets
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.auth import get_password_hash
from app.models import AdminUser, Profile, Project, Skill, Experience, Education, JourneyMilestone, Certification, Achievement, SiteSettings

# Dynamic ephemeral test credentials (no static secrets committed)
TEST_ADMIN_EMAIL = os.getenv("TEST_ADMIN_EMAIL", "testowner@portfolio.local")
TEST_ADMIN_PASSWORD = os.getenv("TEST_ADMIN_PASSWORD", "EphemeralTestPass!2026")

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()

    # Seed an ephemeral admin user for auth tests
    admin = AdminUser(
        email=TEST_ADMIN_EMAIL,
        hashed_password=get_password_hash(TEST_ADMIN_PASSWORD)
    )
    session.add(admin)

    # Seed sample profile
    profile = Profile(
        name="Jampa Durga Lakshmi Narayana",
        role=["Computer Science Undergraduate", "Full-Stack Developer"],
        tagline="Building scalable software",
        bio="Test Bio",
        location="Visakhapatnam, Andhra Pradesh, India",
        email="jampadurgalakshminarayana@gmail.com",
        resume_url="/resume.pdf",
        hero_image="/images/hero.jpg",
        socials={"github": "https://github.com/example"},
        stats=[{"label": "Projects", "value": 10}]
    )
    session.add(profile)

    # Seed site settings
    settings_obj = SiteSettings(
        open_to_work=True,
        work_status_text="Open to Internships",
        resume_url="/resume.pdf",
        theme_default="dark",
        contact_email="alex.student@example.edu"
    )
    session.add(settings_obj)

    # Seed sample project
    proj = Project(
        slug="test-project",
        title="Test Project",
        summary="A test project summary",
        problem="Test problem",
        solution="Test solution",
        features=["Feature 1"],
        architecture="Clean architecture",
        learnings="Database optimization",
        tech=["React", "FastAPI"],
        category="Full-Stack",
        image="/images/test.jpg",
        gallery=["/images/test.jpg"],
        live="https://test.com",
        repo="https://github.com/test",
        featured=True,
        is_published=True
    )
    session.add(proj)

    session.commit()

    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(autouse=True)
def reset_lockout():
    from app.routers.auth import reset_lockout_state
    reset_lockout_state()
    yield
    reset_lockout_state()

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def auth_headers(client):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": TEST_ADMIN_EMAIL, "password": TEST_ADMIN_PASSWORD}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
