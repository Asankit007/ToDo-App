# FILE: app/routes/activity_routes.py

from fastapi import APIRouter, Depends
from datetime import datetime
import pytz

from app.auth.jwt_bearer import JwtBearer
from app.models.activity_model import get_user_activity

router = APIRouter(prefix="/activity", tags=["Activity"])


# -----------------------
# Get user from JWT
# -----------------------
def get_current_user(payload: dict = Depends(JwtBearer())):
    return payload.get("user_id")


# -----------------------
# Clean browser name
# -----------------------
def clean_device_name(device_str: str):
    if not device_str:
        return "Unknown"

    d = device_str.lower()

    if "chrome" in d and "edg" not in d:
        return "Chrome"
    if "edg" in d:
        return "Microsoft Edge"
    if "firefox" in d:
        return "Firefox"
    if "safari" in d and "chrome" not in d:
        return "Safari"
    if "opr" in d or "opera" in d:
        return "Opera"

    return "Unknown"


# -----------------------
# Fetch Activity Logs
# -----------------------
@router.get("/")
def fetch_activity(user_id: str = Depends(get_current_user)):

    logs = get_user_activity(user_id)
    formatted_logs = []

    ist = pytz.timezone("Asia/Kolkata")
    utc = pytz.utc

    for log in logs:
        raw_ts = log.get("timestamp")

        # Convert UTC → IST safely
        if isinstance(raw_ts, datetime):

            # If timestamp has no timezone info (Mongo default)
            if raw_ts.tzinfo is None:
                raw_ts = utc.localize(raw_ts)

            ts_ist = raw_ts.astimezone(ist)
            time_str = ts_ist.strftime("%Y-%m-%d %H:%M:%S")
        else:
            time_str = "Unknown"

        formatted_logs.append({
            "action": log.get("action", ""),
            "description": log.get("description", ""),
            "ip": log.get("ip", "Unknown"),
            "device": clean_device_name(log.get("device", "")),
            "time": time_str,
        })

    return formatted_logs
