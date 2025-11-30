from fastapi import APIRouter

user_router = APIRouter()

@user_router.get("/test")
def test():
    return {"message": "User route working"}
