def test_unauthenticated_requests_blocked(client):
    # Verify all administrative routes reject unauthenticated access with 401
    protected_endpoints = [
        ("POST", "/api/v1/projects", {"title": "X", "slug": "x", "summary": "s", "problem": "p", "solution": "sol", "features": [], "tech": [], "category": "Full-Stack", "image": "img"}),
        ("PUT", "/api/v1/projects/1", {"title": "Updated"}),
        ("DELETE", "/api/v1/projects/1", None),
        ("POST", "/api/v1/skills", {"category": "Test", "items": ["Item1"]}),
        ("PUT", "/api/v1/skills/1", {"category": "Updated"}),
        ("DELETE", "/api/v1/skills/1", None),
        ("POST", "/api/v1/skills/learning/items", {"name": "Test"}),
        ("PUT", "/api/v1/skills/learning/items/1", {"name": "Updated"}),
        ("DELETE", "/api/v1/skills/learning/items/1", None),
        ("POST", "/api/v1/journey", {"year": "2024", "title": "Milestone", "description": "Desc"}),
        ("PUT", "/api/v1/journey/1", {"title": "Updated"}),
        ("DELETE", "/api/v1/journey/1", None),
        ("POST", "/api/v1/certifications", {"title": "Cert", "issuer": "Issuer", "date": "2025"}),
        ("PUT", "/api/v1/certifications/1", {"title": "Updated"}),
        ("DELETE", "/api/v1/certifications/1", None),
        ("POST", "/api/v1/achievements", {"title": "Achieve", "organization": "Org", "description": "Desc", "date": "2025"}),
        ("PUT", "/api/v1/achievements/1", {"title": "Updated"}),
        ("DELETE", "/api/v1/achievements/1", None),
        ("POST", "/api/v1/experience", {"company": "Comp", "title": "Role", "period": "2025", "points": []}),
        ("PUT", "/api/v1/experience/1", {"company": "Updated"}),
        ("DELETE", "/api/v1/experience/1", None),
        ("POST", "/api/v1/education", {"school": "Univ", "degree": "B.Tech", "period": "2023-2027"}),
        ("PUT", "/api/v1/education/1", {"school": "Updated"}),
        ("DELETE", "/api/v1/education/1", None),
        ("PUT", "/api/v1/settings", {"open_to_work": False}),
        ("GET", "/api/v1/backup/export", None),
        ("GET", "/api/v1/contact", None),
        ("DELETE", "/api/v1/contact/1", None),
        ("GET", "/api/v1/auth/me", None)
    ]

    for method, path, body in protected_endpoints:
        if method == "GET":
            res = client.get(path)
        elif method == "POST":
            res = client.post(path, json=body or {})
        elif method == "PUT":
            res = client.put(path, json=body or {})
        elif method == "DELETE":
            res = client.delete(path)
        
        assert res.status_code == 401, f"Expected 401 for unauthenticated {method} {path}, got {res.status_code}"
