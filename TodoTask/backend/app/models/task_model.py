# FILE: app/models/task_model.py

from app.database import tasks_collection
from bson.objectid import ObjectId


from fastapi import Depends
from app.auth.jwt_bearer import JwtBearer



# ---------------------------
# CREATE TASK
# ---------------------------
def create_task(data: dict):
    res = tasks_collection.insert_one(data)
    return str(res.inserted_id)


# ---------------------------
# GET ALL TASKS OF USER
# ---------------------------
def get_tasks_by_user(user_id: str):
    tasks = list(tasks_collection.find({"user_id": user_id}))

    for t in tasks:
        t["_id"] = str(t["_id"])
        if "file" in t:
            t["file"] = t["file"]  # Base64 file (optional)

    return tasks


# ---------------------------
# GET ONE TASK BY ID
# ---------------------------
def get_task_by_id(task_id: str):
    task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    
    if task:
        task["_id"] = str(task["_id"])
        if "file" in task:
            task["file"] = task["file"]

    return task


# ---------------------------
# UPDATE TASK
# ---------------------------
def update_task(task_id: str, data: dict):
    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": data}
    )
    return result.modified_count > 0


# ---------------------------
# DELETE TASK
# ---------------------------
def delete_task(task_id: str):
    result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
    return result.deleted_count > 0


# ---------------------------
# UPDATE STATUS (KANBAN)
# ---------------------------
def update_task_status(task_id: str, status: str):
    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": status}}
    )
    return result.modified_count > 0

## Upcominggg
from bson import ObjectId
from datetime import datetime

def serialize_task(task):
    task["_id"] = str(task["_id"])
    return task

def get_overdue_tasks(user_id: str):
    today = datetime.today().strftime("%Y-%m-%d")

    tasks = list(tasks_collection.find({
        "user_id": user_id,
        "date": {"$lt": today},
        "status": {"$ne": "completed"}
    }))

    return [serialize_task(t) for t in tasks]


def get_upcoming_tasks(user_id: str):
    today = datetime.today().strftime("%Y-%m-%d")

    tasks = list(tasks_collection.find({
        "user_id": user_id,
        "date": {"$gt": today}
    }))

    return [serialize_task(t) for t in tasks]
