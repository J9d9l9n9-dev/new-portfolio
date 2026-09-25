import io

def test_skills_crud(client, auth_headers):
    # 1. Create skill
    create_res = client.post(
        "/api/v1/skills",
        json={"category": "Cloud & Distributed", "items": ["AWS", "Docker", "Redis"]},
        headers=auth_headers
    )
    assert create_res.status_code == 201
    skill_id = create_res.json()["id"]

    # 2. Update skill
    update_res = client.put(
        f"/api/v1/skills/{skill_id}",
        json={"category": "Cloud, Systems & DevOps", "items": ["AWS", "Docker", "Redis", "Kafka"]},
        headers=auth_headers
    )
    assert update_res.status_code == 200
    assert "Kafka" in update_res.json()["items"]

    # 3. Delete skill
    del_res = client.delete(f"/api/v1/skills/{skill_id}", headers=auth_headers)
    assert del_res.status_code == 204

def test_learning_items_crud(client, auth_headers):
    # 1. Create learning item
    create_res = client.post(
        "/api/v1/skills/learning/items",
        json={"name": "Distributed Consensus (Raft)", "category": "Distributed Systems", "status": "In Progress"},
        headers=auth_headers
    )
    assert create_res.status_code == 201
    item_id = create_res.json()["id"]

    # 2. Get learning items
    get_res = client.get("/api/v1/skills/learning/items")
    assert get_res.status_code == 200
    assert any(i["id"] == item_id for i in get_res.json())

    # 3. Update learning item
    update_res = client.put(
        f"/api/v1/skills/learning/items/{item_id}",
        json={"status": "Mastered"},
        headers=auth_headers
    )
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "Mastered"

    # 4. Delete learning item
    del_res = client.delete(f"/api/v1/skills/learning/items/{item_id}", headers=auth_headers)
    assert del_res.status_code == 204

def test_journey_milestones_crud(client, auth_headers):
    # 1. Create milestone
    create_res = client.post(
        "/api/v1/journey",
        json={
            "year": "2024",
            "title": "First Open Source Contribution",
            "description": "Submitted bug fix to popular FastAPI repository.",
            "tag": "Open Source"
        },
        headers=auth_headers
    )
    assert create_res.status_code == 201
    milestone_id = create_res.json()["id"]

    # 2. Public get
    get_res = client.get("/api/v1/journey")
    assert get_res.status_code == 200
    assert any(m["id"] == milestone_id for m in get_res.json())

    # 3. Update milestone
    update_res = client.put(
        f"/api/v1/journey/{milestone_id}",
        json={"title": "Major Open Source Contribution"},
        headers=auth_headers
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Major Open Source Contribution"

    # 4. Delete milestone
    del_res = client.delete(f"/api/v1/journey/{milestone_id}", headers=auth_headers)
    assert del_res.status_code == 204

def test_certifications_crud(client, auth_headers):
    # 1. Create certification
    create_res = client.post(
        "/api/v1/certifications",
        json={
            "title": "AWS Cloud Practitioner",
            "issuer": "Amazon Web Services",
            "date": "2025",
            "credential_url": "https://aws.amazon.com/verify",
            "badge_image": "/images/cert-aws.svg"
        },
        headers=auth_headers
    )
    assert create_res.status_code == 201
    cert_id = create_res.json()["id"]

    # 2. Public get
    get_res = client.get("/api/v1/certifications")
    assert get_res.status_code == 200
    assert any(c["id"] == cert_id for c in get_res.json())

    # 3. Update certification
    update_res = client.put(
        f"/api/v1/certifications/{cert_id}",
        json={"title": "AWS Certified Solutions Architect"},
        headers=auth_headers
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "AWS Certified Solutions Architect"

    # 4. Delete certification
    del_res = client.delete(f"/api/v1/certifications/{cert_id}", headers=auth_headers)
    assert del_res.status_code == 204

def test_achievements_crud(client, auth_headers):
    # 1. Create achievement
    create_res = client.post(
        "/api/v1/achievements",
        json={
            "title": "Hackathon 1st Place",
            "organization": "National Tech Fest",
            "description": "Built AI scheduler in 24 hours.",
            "date": "2025",
            "badge": "1st Place"
        },
        headers=auth_headers
    )
    assert create_res.status_code == 201
    achieve_id = create_res.json()["id"]

    # 2. Public get
    get_res = client.get("/api/v1/achievements")
    assert get_res.status_code == 200
    assert any(a["id"] == achieve_id for a in get_res.json())

    # 3. Update achievement
    update_res = client.put(
        f"/api/v1/achievements/{achieve_id}",
        json={"badge": "Winner"},
        headers=auth_headers
    )
    assert update_res.status_code == 200
    assert update_res.json()["badge"] == "Winner"

    # 4. Delete achievement
    del_res = client.delete(f"/api/v1/achievements/{achieve_id}", headers=auth_headers)
    assert del_res.status_code == 204

def test_site_settings_and_backup(client, auth_headers):
    # 1. Get settings
    get_res = client.get("/api/v1/settings")
    assert get_res.status_code == 200
    assert "open_to_work" in get_res.json()

    # 2. Update settings
    up_res = client.put(
        "/api/v1/settings",
        json={"open_to_work": False, "work_status_text": "Evaluating Offers"},
        headers=auth_headers
    )
    assert up_res.status_code == 200
    assert up_res.json()["open_to_work"] is False

    # 3. Export backup JSON
    backup_res = client.get("/api/v1/backup/export", headers=auth_headers)
    assert backup_res.status_code == 200
    assert "application/json" in backup_res.headers.get("content-type", "")
    data = backup_res.json()
    assert "profile" in data
    assert "projects" in data

def test_experience_crud(client, auth_headers):
    create_res = client.post(
        "/api/v1/experience",
        json={
            "company": "Test Company",
            "title": "Backend Intern",
            "period": "May 2025 - Aug 2025",
            "points": ["Built microservices", "Wrote unit tests"]
        },
        headers=auth_headers
    )
    assert create_res.status_code == 201
    exp_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/experience/{exp_id}", headers=auth_headers)
    assert del_res.status_code == 204

def test_education_crud(client, auth_headers):
    create_res = client.post(
        "/api/v1/education",
        json={
            "school": "Institute of Engineering",
            "degree": "B.Tech Computer Science",
            "period": "2023 - 2027"
        },
        headers=auth_headers
    )
    assert create_res.status_code == 201
    edu_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/education/{edu_id}", headers=auth_headers)
    assert del_res.status_code == 204

def test_upload_image_validation(client, auth_headers):
    # 1. Valid PNG upload
    file_content = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    files = {"file": ("test.png", io.BytesIO(file_content), "image/png")}
    res = client.post("/api/v1/upload", files=files, headers=auth_headers)
    assert res.status_code == 201
    assert "url" in res.json()

    # 2. Invalid file type rejected
    bad_files = {"file": ("malicious.exe", io.BytesIO(b"executable"), "application/x-msdownload")}
    bad_res = client.post("/api/v1/upload", files=bad_files, headers=auth_headers)
    assert bad_res.status_code == 400
    assert "Unsupported file type" in bad_res.json()["detail"]
