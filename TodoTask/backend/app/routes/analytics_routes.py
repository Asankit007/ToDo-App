from fastapi import APIRouter

analytics_router = APIRouter()

@analytics_router.get("/test")
def test():
    return {"message": "Analytics working"}
