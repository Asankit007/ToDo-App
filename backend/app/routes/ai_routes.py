from fastapi import APIRouter, Depends, HTTPException
from app.auth.jwt_bearer import JwtBearer
from app.models.task_model import get_tasks_by_user
import requests
import traceback

router = APIRouter(prefix="/ai", tags=["AI Summary"])

# 🔥 Replace with your Groq API Key
GROQ_API_KEY = "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"

@router.get("/summary")
def ai_summary(payload: dict = Depends(JwtBearer())):
    try:
        user_id = payload["user_id"]

        tasks = get_tasks_by_user(user_id)

        if not tasks:
            return {"summary": "You don’t have any tasks yet. Add tasks to receive analysis."}

        # Convert tasks to text
        tasks_text = "\n".join([
            f"- {t['title']} | Priority: {t.get('priority')} | Status: {t.get('status')}"
            for t in tasks
        ])

        prompt = f"""
        Analyze these tasks and provide:
        1) A short productivity summary
        2) Weak areas / what to improve
        3) Actionable suggestions

        Tasks:
        {tasks_text}
        """

        url = "https://api.groq.com/openai/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        }

        data = {
            "model": "llama-3.1-8b-instant",  # ✔ ACTIVE MODEL
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }

        response = requests.post(url, json=data, headers=headers)

        print("\n===== GROQ API DEBUG =====")
        print("STATUS:", response.status_code)
        print("BODY:", response.text)
        print("==========================\n")

        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"Groq Error: {response.text}"
            )

        reply = response.json()["choices"][0]["message"]["content"]
        return {"summary": reply}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Server Error: {str(e)}"
        )
