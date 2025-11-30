from bson.objectid import ObjectId
from app.database import users_collection
from bson.objectid import ObjectId
from app.database import users_collection
from app.auth.hash import hash_password, verify_password

# ----------------------------
# CREATE USER
# ----------------------------
def create_user(user_data):
    result = users_collection.insert_one(user_data)
    return str(result.inserted_id)


# ----------------------------
# GET USER BY EMAIL
# ----------------------------
def get_user_by_email(email: str):
    return users_collection.find_one({"email": email})


# ----------------------------
# GET USER BY ID
# ----------------------------
def get_user_by_id(user_id: str):
    try:
        obj_id = ObjectId(user_id)
    except:
        return None

    return users_collection.find_one({"_id": obj_id})


# ----------------------------
# UPDATE USER PROFILE
# ----------------------------
def update_user_profile(user_id: str, data: dict):
    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": data}
    )
    return result.modified_count > 0


def update_user_password(user_id: str, new_password: str):
    new_hashed = hash_password(new_password)

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password": new_hashed}}
    )
    return True
