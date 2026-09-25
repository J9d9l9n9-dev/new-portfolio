def test_submit_contact_message_success(client):
    payload = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "subject": "Exciting Opportunity",
        "message": "Hello Jampa, I would love to talk about our engineering open role."
    }
    response = client.post("/api/v1/contact", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Jane Doe"
    assert data["id"] is not None

def test_submit_contact_invalid_email(client):
    payload = {
        "name": "Jane Doe",
        "email": "not-an-email",
        "subject": "Hello",
        "message": "Valid length message content here."
    }
    response = client.post("/api/v1/contact", json=payload)
    assert response.status_code == 422

def test_submit_contact_message_too_short(client):
    payload = {
        "name": "Jane",
        "email": "jane@example.com",
        "subject": "Hi",
        "message": "Short"
    }
    response = client.post("/api/v1/contact", json=payload)
    assert response.status_code == 422

def test_get_contact_messages_admin(client, auth_headers):
    # Submit one first
    client.post("/api/v1/contact", json={
        "name": "Recruiter One",
        "email": "recruiter@tech.com",
        "subject": "Interview",
        "message": "Let us schedule a conversation this week."
    })

    response = client.get("/api/v1/contact", headers=auth_headers)
    assert response.status_code == 200
    messages = response.json()
    assert len(messages) >= 1
    assert messages[0]["email"] == "recruiter@tech.com"

def test_get_contact_messages_unauthorized(client):
    response = client.get("/api/v1/contact")
    assert response.status_code == 401

def test_delete_contact_message(client, auth_headers):
    # Submit a message to delete
    res = client.post("/api/v1/contact", json={
        "name": "Delete Me",
        "email": "delete@test.com",
        "subject": "Delete Test",
        "message": "This message will be deleted by test."
    })
    msg_id = res.json()["id"]

    # Delete as admin
    del_res = client.delete(f"/api/v1/contact/{msg_id}", headers=auth_headers)
    assert del_res.status_code == 204

    # Verify not in list
    list_res = client.get("/api/v1/contact", headers=auth_headers)
    ids = [m["id"] for m in list_res.json()]
    assert msg_id not in ids
