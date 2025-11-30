# FILE: app/routes/auth_routes.py

from fastapi import APIRouter, HTTPException, Request, Depends
from app.schemas.user_schema import UserLogin, UserCreate, UserProfileUpdate
from app.models.user_model import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    update_user_profile,
    update_user_password
)
from app.auth.hash import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from app.auth.jwt_bearer import JwtBearer
from app.models.activity_model import log_activity



from app.auth.email_utils import send_otp_email
from app.models.user_model import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    update_user_profile,
    update_user_password,   # already there
)
from app.auth.hash import hash_password, verify_password


router = APIRouter(prefix="/auth")


# -----------------------------------
# DEVICE + IP DETECTOR (from frontend)
# -----------------------------------
def detect_device(request: Request):
    ua = request.headers.get("X-Device", "")  # coming from frontend
    ip = request.client.host

    # Extract only browser name (Chrome, Firefox etc)
    if "Chrome" in ua:
        ua = "Chrome"
    elif "Firefox" in ua:
        ua = "Firefox"
    elif "Safari" in ua:
        ua = "Safari"
    elif "Edge" in ua:
        ua = "Edge"
    else:
        ua = "Unknown"

    return ua, ip


# ----------------------------------------------------
# USER SIGNUP
# ----------------------------------------------------
@router.post("/signup")
async def signup(request: Request):
    body = await request.json()
    user = UserCreate(**body)

    existing = get_user_by_email(user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)

    user_id = create_user({
        "name": user.name,
        "email": user.email,
        "password": hashed,
        
    })

    # Log activity
    device, ip = detect_device(request)
    log_activity({
        "user_id": user_id,
        "action": "signup",
        "description": "User created an account",
        "device": device,
        "ip": ip
    })

    return {"message": "Signup successful", "user_id": user_id}


# ----------------------------------------------------
# USER LOGIN
# ----------------------------------------------------
@router.post("/login")
async def login(request: Request):
    body = await request.json()
    user = UserLogin(**body)
    db_user = get_user_by_email(user.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect password")

    token = create_access_token({"user_id": str(db_user["_id"])})

    # Log activity
    device, ip = detect_device(request)
    log_activity({
        "user_id": str(db_user["_id"]),
        "action": "login",
        "description": "User logged in",
        "device": device,
        "ip": ip
    })

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(db_user["_id"]),
            "name": db_user["name"],
            "email": db_user["email"]
        }
    }

from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel

# ---------- Pydantic Schemas ----------
class ForgotPasswordRequest(BaseModel):
  email: str

class ResetPasswordRequest(BaseModel):
  email: str
  otp: str
  new_password: str

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    """Step 1: User enters email, we send OTP to email."""
    email = data.email.strip().lower()

    user = get_user_by_email(email)
    if not user:
        # Don't reveal if user exists or not (for security),
        # but for now you can send 404:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate 6-digit OTP
    import random
    otp = str(random.randint(100000, 999999))

  

    # Send email via Gmail SMTP
    send_otp_email(email, otp)

    return {"message": "OTP sent to your email"}

@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    """
    Step 2: User sends email + OTP + new password.
    If OTP is valid, update password.
    """
    email = data.email.strip().lower()
    otp = data.otp.strip()
    new_password = data.new_password

    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    

    # Hash new password
    hashed = hash_password(new_password)

    # Update user password
    update_user_password(str(user["_id"]), new_password)

   
# ----------------------------------------------------
# GET PROFILE
# ----------------------------------------------------
@router.get("/me")
def get_profile(payload: dict = Depends(JwtBearer())):
    user_id = payload["user_id"]
    user = get_user_by_id(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "bio": user.get("bio", ""),
        "profile_pic": user.get("profile_pic", "")
    }


# ----------------------------------------------------
# UPDATE PROFILE
# ----------------------------------------------------
@router.put("/update")
async def update_profile(
    data: UserProfileUpdate,
    request: Request,
    payload: dict = Depends(JwtBearer())
):

    user_id = payload["user_id"]

    updated = update_user_profile(user_id, data.dict(exclude_none=True))
    if not updated:
        raise HTTPException(status_code=400, detail="Update failed")

    # Log activity
    device, ip = detect_device(request)
    log_activity({
        "user_id": user_id,
        "action": "profile_update",
        "description": "User updated profile",
        "device": device,
        "ip": ip
    })

    return {"message": "Profile updated successfully"}


# ----------------------------------------------------
# CHANGE PASSWORD
# ----------------------------------------------------
@router.put("/change-password")
async def change_password(request: Request, payload: dict = Depends(JwtBearer())):

    body = await request.json()
    current_password = body.get("current_password")
    new_password = body.get("new_password")

    user_id = payload["user_id"]
    user = get_user_by_id(user_id)

    if not verify_password(current_password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    hashed = hash_password(new_password)
    update_user_password(user_id, hashed)

    # Log activity
    device, ip = detect_device(request)
    log_activity({
        "user_id": user_id,
        "action": "password_change",
        "description": "User changed password",
        "device": device,
        "ip": ip
    })

    return {"message": "Password updated successfully"}

from app.models.activity_model import delete_user_activity

@router.post("/logout")
def logout_user(payload: dict = Depends(JwtBearer())):
    user_id = payload["user_id"]

    from app.models.activity_model import delete_user_activity
    delete_user_activity(user_id)

    return {"message": "Logout successful, activity cleared"}

from pydantic import BaseModel
from fastapi import HTTPException
from app.models.otp_model import save_otp
from app.auth.email_utils import send_otp_email

class ForgotPasswordRequest(BaseModel):
    email: str

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    email = data.email.lower()

    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    import random
    otp = str(random.randint(100000, 999999))

    save_otp(email, otp)
    send_otp_email(email, otp)

    return {"message": "OTP sent to your email"}

from app.models.otp_model import verify_otp, mark_otp_used
from app.auth.hash import hash_password

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str
from app.database import users_collection
@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):

    email = data.email.strip().lower()
    otp = data.otp.strip()
    new_password = data.new_password

    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check OTP
    if not verify_otp(email, otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Hash new password
    hashed = hash_password(new_password)

    # Directly update password (no old password needed)
    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hashed}}
    )

    mark_otp_used(email, otp)

    return {"message": "Password reset successful"}
