from fastapi import FastAPI
from app.routes.auth_routes import router as auth_router
from app.routes.task_routes import router as task_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.activity_routes import router as activity_router
from fastapi.staticfiles import StaticFiles
from app.routes.voice_routes import router as voice_router 
from app.routes.ai_routes import router as ai_router
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(activity_router)
app.include_router(auth_router)          # remove prefix="/auth"
app.include_router(task_router)
app.include_router(voice_router)
app.include_router(ai_router)


@app.get("/")
def root():
    return {"message": "Backend running"}
