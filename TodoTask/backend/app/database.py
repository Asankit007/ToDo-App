from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["task_manager_db"]

users_collection = db["users"]
tasks_collection = db["tasks"]
activity_collection = db["activity_logs"]
otp_collection = db["otp_codes"]

