from tests.conftest import TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD

def test_login_success(client):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": TEST_ADMIN_EMAIL, "password": TEST_ADMIN_PASSWORD}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert "refresh_token" in response.cookies

def test_login_json_success(client):
    response = client.post(
        "/api/v1/auth/login-json",
        json={"email": TEST_ADMIN_EMAIL, "password": TEST_ADMIN_PASSWORD}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "refresh_token" in response.json()

def test_login_invalid_password(client):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": TEST_ADMIN_EMAIL, "password": "WrongPassword!"}
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

def test_login_lockout_after_repeated_failures(client):
    # Attempt 5 consecutive failed logins
    for i in range(5):
        resp = client.post(
            "/api/v1/auth/login",
            data={"username": TEST_ADMIN_EMAIL, "password": f"Wrong_{i}"}
        )
    # The 5th or subsequent attempt must result in 429 Too Many Requests
    assert resp.status_code == 429
    assert "locked" in resp.json()["detail"].lower()

def test_refresh_token_flow(client):
    # 1. Login to get refresh token
    login_resp = client.post(
        "/api/v1/auth/login",
        data={"username": TEST_ADMIN_EMAIL, "password": TEST_ADMIN_PASSWORD}
    )
    refresh_token = login_resp.json()["refresh_token"]

    # 2. Call /refresh with body
    refresh_resp = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token}
    )
    assert refresh_resp.status_code == 200
    data = refresh_resp.json()
    assert "access_token" in data
    assert data["access_token"] != ""

def test_logout(client):
    response = client.post("/api/v1/auth/logout")
    assert response.status_code == 200
    assert response.json()["message"] == "Successfully logged out"

def test_me_endpoint_authorized(client, auth_headers):
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["email"] == TEST_ADMIN_EMAIL
    assert response.json()["authenticated"] is True

def test_me_endpoint_unauthorized(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
