from app.database import otp_collection
from datetime import datetime, timedelta

def save_otp(email, otp):
    otp_collection.insert_one({
        "email": email,
        "otp": otp,
        "used": False,
        "created_at": datetime.utcnow()
    })

def verify_otp(email, otp):
    record = otp_collection.find_one({
        "email": email,
        "otp": otp,
        "used": False
    })

    if not record:
        return False

    # Expire after 10 minutes
    if datetime.utcnow() > record["created_at"] + timedelta(minutes=10):
        return False

    return True

def mark_otp_used(email, otp):
    otp_collection.update_one(
        {"email": email, "otp": otp},
        {"$set": {"used": True}}
    )
