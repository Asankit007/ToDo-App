from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/voice", tags=["Voice Assistant"])

class VoiceCommand(BaseModel):
    text: str


@router.post("/command")
def voice_command(data: VoiceCommand):
    text = data.text.lower()

    # ====================
    #   TASK ACTIONS
    # ====================
    if "create task" in text or "add task" in text:
        return {"reply": "Opening task creation…", "action": "open_add_task"}

    # ====================
    #   NAVIGATION
    # ====================
    if "dashboard" in text or "go to dashboard" in text:
        return {"reply": "Opening dashboard…", "action": "open_dashboard"}

    if "open tasks" in text or "show my tasks" in text:
        return {"reply": "Opening tasks list…", "action": "open_tasks"}

    if "kanban" in text or "kanban board" in text:
        return {"reply": "Opening Kanban…", "action": "open_kanban"}

    if "open analytics" in text or "analytics" in text:
        return {"reply": "Opening analytics…", "action": "open_analytics"}

    if "open profile" in text or "profile" in text:
        return {"reply": "Opening your profile…", "action": "open_profile"}

    # ====================
    #   BASIC RESPONSES
    # ====================
    if "hello" in text or "hi" in text:
        return {"reply": "Hello! How can I assist you?"}

    # DEFAULT RESPONSE
    return {
        "reply": f"I heard: {data.text}",
        "action": None
    }
