def test_get_projects(client):
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    projects = response.json()
    assert len(projects) >= 1
    assert projects[0]["slug"] == "test-project"

def test_get_projects_by_category(client):
    response = client.get("/api/v1/projects?category=Full-Stack")
    assert response.status_code == 200
    assert len(response.json()) >= 1

    empty_response = client.get("/api/v1/projects?category=NonExistent")
    assert empty_response.status_code == 200
    assert len(empty_response.json()) == 0

def test_get_project_by_slug(client):
    response = client.get("/api/v1/projects/test-project")
    assert response.status_code == 200
    assert response.json()["title"] == "Test Project"

def test_get_project_by_invalid_slug(client):
    response = client.get("/api/v1/projects/non-existent-slug")
    assert response.status_code == 404

def test_create_project_authorized(client, auth_headers):
    payload = {
        "slug": "new-portfolio",
        "title": "New Portfolio System",
        "summary": "Summary of portfolio",
        "problem": "Legacy design",
        "solution": "Modern architecture",
        "features": ["Feature A", "Feature B"],
        "tech": ["Python", "FastAPI"],
        "category": "Full-Stack",
        "image": "/images/new.jpg",
        "live": "https://new.com",
        "repo": "https://github.com/new",
        "featured": True
    }
    response = client.post("/api/v1/projects", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["slug"] == "new-portfolio"
    assert data["id"] is not None

def test_create_project_unauthorized(client):
    payload = {
        "slug": "unauthorized-proj",
        "title": "Unauthorized",
        "summary": "...",
        "problem": "...",
        "solution": "...",
        "features": [],
        "tech": [],
        "category": "Full-Stack",
        "image": "/img.jpg"
    }
    response = client.post("/api/v1/projects", json=payload)
    assert response.status_code == 401

def test_update_project(client, auth_headers):
    # First get the existing project id
    proj = client.get("/api/v1/projects/test-project").json()
    proj_id = proj["id"]

    update_payload = {"title": "Updated Title"}
    response = client.put(f"/api/v1/projects/{proj_id}", json=update_payload, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"

def test_delete_project(client, auth_headers):
    proj = client.get("/api/v1/projects/test-project").json()
    proj_id = proj["id"]

    response = client.delete(f"/api/v1/projects/{proj_id}", headers=auth_headers)
    assert response.status_code == 204

    # Verify deleted
    get_res = client.get("/api/v1/projects/test-project")
    assert get_res.status_code == 404

def test_removed_project_slugs_return_404(client):
    for removed_slug in ["currency-converter", "student-management-system", "attendance-management-system"]:
        res = client.get(f"/api/v1/projects/{removed_slug}")
        assert res.status_code == 404, f"Removed slug {removed_slug} should return 404 but got {res.status_code}"
