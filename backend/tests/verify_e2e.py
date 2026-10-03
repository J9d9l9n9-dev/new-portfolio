import httpx

def main():
    print("Testing live Frontend and Backend integration...")

    # 1. Frontend routes
    for route in ['/', '/projects/developer-portfolio', '/admin', '/images/hero.jpg']:
        r = httpx.get(f"http://localhost:5173{route}", timeout=3)
        assert r.status_code == 200, f"Route {route} failed with {r.status_code}"
        print(f"[OK] Frontend route {route} -> 200")

    # 2. Backend endpoints
    for endpoint in ['/profile', '/projects', '/projects/developer-portfolio', '/skills', '/experience', '/education']:
        r = httpx.get(f"http://localhost:8000/api/v1{endpoint}", timeout=3)
        assert r.status_code == 200, f"Endpoint {endpoint} failed with {r.status_code}"
        print(f"[OK] Backend endpoint /api/v1{endpoint} -> 200")

    # 3. Contact submission
    contact_payload = {
        "name": "Maya Patel",
        "email": "maya.patel@example.com",
        "subject": "Software Engineering Internship Opportunity",
        "message": "Hello Jampa, we are very impressed with your portfolio architecture and would love to interview you."
    }
    r_contact = httpx.post("http://localhost:8000/api/v1/contact", json=contact_payload, timeout=3)
    assert r_contact.status_code == 201, f"Contact post failed with {r_contact.status_code}"
    msg_id = r_contact.json()["id"]
    print(f"[OK] Contact submission -> 201, message_id={msg_id}")

    # 4. Admin Login
    auth_payload = {
        "email": "jampadurgalakshminarayana@gmail.com",
        "password": "AdminPass123!"
    }
    r_auth = httpx.post("http://localhost:8000/api/v1/auth/login-json", json=auth_payload, timeout=3)
    assert r_auth.status_code == 200, f"Auth failed with {r_auth.status_code}"
    token = r_auth.json()["access_token"]
    print("[OK] Admin login -> 200, JWT token acquired")

    # 5. Fetch Admin Messages with JWT
    headers = {"Authorization": f"Bearer {token}"}
    r_msgs = httpx.get("http://localhost:8000/api/v1/contact", headers=headers, timeout=3)
    assert r_msgs.status_code == 200, f"Get messages failed with {r_msgs.status_code}"
    messages = r_msgs.json()
    assert len(messages) >= 1
    print(f"[OK] Admin retrieved {len(messages)} contact message(s) from database -> 200")

    print("\n==========================================")
    print("ALL FULL-STACK INTEGRATION TESTS PASSED!")
    print("==========================================")

if __name__ == "__main__":
    main()
