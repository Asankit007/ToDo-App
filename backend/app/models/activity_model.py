# FILE: app/models/activity_model.py

from app.database import activity_collection
from datetime import datetime

def log_activity(data):
    # Always store in UTC
    data["timestamp"] = datetime.utcnow()
    activity_collection.insert_one(data)


def get_user_activity(user_id: str):
    return list(
        activity_collection.find({"user_id": user_id}).sort("timestamp", -1)
    )

def delete_user_activity(user_id: str):
    activity_collection.delete_many({"user_id": user_id})
    return True
