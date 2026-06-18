import os
import requests

BASE_URL = os.getenv("API_URL", "http://localhost:8000")
REACT_URL = os.getenv("REACT_URL", "http://localhost:3000")
ADMINER_URL = "http://localhost:8080"

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "loise.fenoll@ynov.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "PvdrTAzTeR247sDnAZBr")

TEST_USER = {
    "lastName": "InfraTest",
    "firstName": "User",
    "email": "infra.test@testmail.com",
    "birthDate": "1990-01-01",
    "city": "Paris",
    "postalCode": "75001",
}

def test_api_server_is_accessible():
    r = requests.get(f"{BASE_URL}/users")
    assert r.status_code == 200

def test_adminer_is_accessible():
    r = requests.get(ADMINER_URL)
    assert r.status_code == 200

def test_react_frontend_is_accessible():
    r = requests.get(REACT_URL)
    assert r.status_code == 200

def test_get_users_returns_list_structure():
    r = requests.get(f"{BASE_URL}/users")
    assert r.status_code == 200
    data = r.json()
    assert "utilisateurs" in data
    assert isinstance(data["utilisateurs"], list)

def test_admin_account_not_visible_in_public_list():
    r = requests.get(f"{BASE_URL}/users")
    emails = [u["email"] for u in r.json()["utilisateurs"]]
    assert ADMIN_EMAIL not in emails

def test_admin_login_success():
    r = requests.post(f"{BASE_URL}/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
    })
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert data["is_admin"] is True

def test_login_wrong_password_fails():
    r = requests.post(f"{BASE_URL}/login", json={
        "email": ADMIN_EMAIL,
        "password": "mauvaismdp",
    })
    assert r.status_code == 200
    assert r.json()["success"] is False

def test_login_unknown_email_fails():
    r = requests.post(f"{BASE_URL}/login", json={
        "email": "inconnu@mail.com",
        "password": "x",
    })
    assert r.status_code == 200
    assert r.json()["success"] is False

def test_create_user_success():
    r = requests.post(f"{BASE_URL}/users", json=TEST_USER)
    assert r.status_code == 200
    assert r.json()["message"] == "Utilisateur créé"

def test_duplicate_email_returns_409():
    r = requests.post(f"{BASE_URL}/users", json=TEST_USER)
    assert r.status_code == 409

def test_user_appears_in_list_after_creation():
    r = requests.get(f"{BASE_URL}/users")
    emails = [u["email"] for u in r.json()["utilisateurs"]]
    assert TEST_USER["email"] in emails

def test_admin_can_view_user_details():
    users = requests.get(f"{BASE_URL}/users").json()["utilisateurs"]
    user_id = next(u["id"] for u in users if u["email"] == TEST_USER["email"])

    r = requests.get(
        f"{BASE_URL}/users/{user_id}",
        params={"admin_email": ADMIN_EMAIL, "admin_password": ADMIN_PASSWORD},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == TEST_USER["email"]
    assert data["city"] == TEST_USER["city"]
    assert data["postalCode"] == TEST_USER["postalCode"]

def test_view_details_denied_without_admin_credentials():
    users = requests.get(f"{BASE_URL}/users").json()["utilisateurs"]
    user_id = users[0]["id"]

    r = requests.get(
        f"{BASE_URL}/users/{user_id}",
        params={"admin_email": "mauvais@mail.com", "admin_password": "bad"},
    )
    assert r.status_code == 403

def test_delete_denied_without_admin_credentials():
    users = requests.get(f"{BASE_URL}/users").json()["utilisateurs"]
    user_id = users[0]["id"]

    r = requests.delete(
        f"{BASE_URL}/users/{user_id}",
        params={"admin_email": "mauvais@mail.com", "admin_password": "bad"},
    )
    assert r.status_code == 403

def test_admin_can_delete_user():
    users = requests.get(f"{BASE_URL}/users").json()["utilisateurs"]
    user_id = next(u["id"] for u in users if u["email"] == TEST_USER["email"])

    r = requests.delete(
        f"{BASE_URL}/users/{user_id}",
        params={"admin_email": ADMIN_EMAIL, "admin_password": ADMIN_PASSWORD},
    )
    assert r.status_code == 200

def test_user_gone_after_deletion():
    r = requests.get(f"{BASE_URL}/users")
    emails = [u["email"] for u in r.json()["utilisateurs"]]
    assert TEST_USER["email"] not in emails
