import mysql.connector
import os
import hashlib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    return mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


@app.on_event("startup")
def create_admin():
    admin_email = os.getenv("ADMIN_EMAIL", "test@testmail.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "abcDEF123!")
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id FROM users WHERE email = %s", (admin_email,))
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO users (lastName, firstName, email, birthDate, city, postalCode, is_admin, password_hash) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            ("Admin", "Admin", admin_email, "1990-01-01", "Paris", "75000", True, hash_password(admin_password))
        )
        conn.commit()
    conn.close()


class UserForm(BaseModel):
    lastName: str
    firstName: str
    email: str
    birthDate: str
    city: str
    postalCode: str


class LoginForm(BaseModel):
    email: str
    password: str


@app.get("/users")
def get_users():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, firstName, lastName, email FROM users WHERE is_admin = FALSE")
    records = cursor.fetchall()
    conn.close()
    return {"utilisateurs": records}


@app.post("/users")
def create_user(user: UserForm):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (lastName, firstName, email, birthDate, city, postalCode) VALUES (%s, %s, %s, %s, %s, %s)",
            (user.lastName, user.firstName, user.email, user.birthDate, user.city, user.postalCode)
        )
        conn.commit()
    except mysql.connector.IntegrityError:
        conn.close()
        raise HTTPException(status_code=409, detail="Email déjà utilisé")
    conn.close()
    return {"message": "Utilisateur créé"}


@app.post("/login")
def login(form: LoginForm):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT password_hash, is_admin FROM users WHERE email = %s", (form.email,))
    user = cursor.fetchone()
    conn.close()
    if not user or user["password_hash"] != hash_password(form.password):
        return {"success": False}
    return {"success": True, "is_admin": bool(user["is_admin"])}


@app.get("/users/{user_id}")
def get_user(user_id: int, admin_email: str, admin_password: str):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT password_hash, is_admin FROM users WHERE email = %s", (admin_email,))
    admin = cursor.fetchone()
    if not admin or not admin["is_admin"] or admin["password_hash"] != hash_password(admin_password):
        conn.close()
        raise HTTPException(status_code=403, detail="Accès refusé")
    cursor.execute(
        "SELECT id, lastName, firstName, email, birthDate, city, postalCode FROM users WHERE id = %s AND is_admin = FALSE",
        (user_id,)
    )
    user = cursor.fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user


@app.delete("/users/{user_id}")
def delete_user(user_id: int, admin_email: str, admin_password: str):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT password_hash, is_admin FROM users WHERE email = %s", (admin_email,))
    admin = cursor.fetchone()
    if not admin or not admin["is_admin"] or admin["password_hash"] != hash_password(admin_password):
        conn.close()
        raise HTTPException(status_code=403, detail="Accès refusé")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s AND is_admin = FALSE", (user_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    if affected == 0:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return {"message": "Utilisateur supprimé"}
