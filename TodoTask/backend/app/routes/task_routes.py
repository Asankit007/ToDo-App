# FILE: app/routes/task_routes.py

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from datetime import datetime
from io import StringIO, BytesIO
import csv
from reportlab.pdfgen import canvas

from app.schemas.task_schema import TaskCreate, TaskUpdate
from app.auth.jwt_bearer import JwtBearer
from app.models.task_model import (
    create_task,
    get_tasks_by_user,
    update_task,
    delete_task,
    get_task_by_id,
    get_upcoming_tasks,
    get_overdue_tasks
)
from app.models.activity_model import log_activity

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# ---------------------------------------------------
# JWT: Get logged-in user
# ---------------------------------------------------
def get_current_user(payload: dict = Depends(JwtBearer())):
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid Token")
    return user_id


# ---------------------------------------------------
# ANALYTICS (MUST BE ABOVE /{task_id})
# ---------------------------------------------------
@router.get("/analytics")
def analytics(user_id: str = Depends(get_current_user)):

    tasks = get_tasks_by_user(user_id)

    status_map = {
        "todo": "To Do",
        "inprogress": "In Progress",
        "completed": "Completed",
        "blocked": "Blocked",
    }

    status_count = {v: 0 for v in status_map.values()}
    priority_count = {"High": 0, "Medium": 0, "Low": 0}
    weekly = {}

    for t in tasks:
        s = t.get("status", "todo")
        status_count[status_map.get(s, "To Do")] += 1

        p = t.get("priority", "Low")
        if p in priority_count:
            priority_count[p] += 1

        if t.get("status") == "completed":
            date_str = t.get("date")
            if date_str:
                try:
                    dt = datetime.strptime(date_str, "%Y-%m-%d")
                    week_no = dt.isocalendar().week
                    weekly[week_no] = weekly.get(week_no, 0) + 1
                except:
                    pass

    return {
        "statusData": [
            {"name": "To Do", "value": status_count["To Do"]},
            {"name": "In Progress", "value": status_count["In Progress"]},
            {"name": "Completed", "value": status_count["Completed"]},
            {"name": "Blocked", "value": status_count["Blocked"]},
        ],
        "priorityData": [
            {"name": "High", "count": priority_count["High"]},
            {"name": "Medium", "count": priority_count["Medium"]},
            {"name": "Low", "count": priority_count["Low"]},
        ],
        "productivityData": [
            {"week": f"Week {week}", "tasks": count}
            for week, count in sorted(weekly.items())
        ],
    }


# ---------------------------------------------------
# CREATE TASK
# ---------------------------------------------------
@router.post("/")
def add_task(task: TaskCreate, request: Request, user_id: str = Depends(get_current_user)):

    data = {
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "date": task.date,
        "status": task.status or "todo",
        "file": task.file,
        "file_name": task.file_name,
        "original_file_name": task.original_file_name,
        "user_id": user_id,
    }

    task_id = create_task(data)

    log_activity({
        "user_id": user_id,
        "action": "task_create",
        "description": f"Created task: {task.title}",
        "device": request.headers.get("User-Agent"),
        "ip": request.client.host,
    })

    return {"message": "Task created", "task_id": task_id}


# ---------------------------------------------------
# UPDATE TASK
# ---------------------------------------------------
@router.put("/{task_id}")
def edit_task(task_id: str, task: TaskUpdate, request: Request, user_id: str = Depends(get_current_user)):

    existing = get_task_by_id(task_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Task not found")

    if existing["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    update_task(task_id, task.dict(exclude_none=True))

    log_activity({
        "user_id": user_id,
        "action": "task_update",
        "description": f"Updated task: {task_id}",
        "device": request.headers.get("User-Agent"),
        "ip": request.client.host,
    })

    return {"message": "Task updated"}


# ---------------------------------------------------
# DELETE TASK
# ---------------------------------------------------
@router.delete("/{task_id}")
def remove_task(task_id: str, request: Request, user_id: str = Depends(get_current_user)):

    existing = get_task_by_id(task_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Task not found")

    if existing["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    delete_task(task_id)

    log_activity({
        "user_id": user_id,
        "action": "task_delete",
        "description": f"Deleted task: {task_id}",
        "device": request.headers.get("User-Agent"),
        "ip": request.client.host,
    })

    return {"message": "Task deleted"}


# ---------------------------------------------------
# GET ALL TASKS
# ---------------------------------------------------
@router.get("/")
def all_tasks(user_id: str = Depends(get_current_user)):
    return get_tasks_by_user(user_id)


# ---------------------------------------------------
# UPCOMING & OVERDUE (IMPORTANT: ABOVE /{task_id})
# ---------------------------------------------------
@router.get("/overdue")
def overdue_tasks(user_id: str = Depends(get_current_user)):
    return get_overdue_tasks(user_id)


@router.get("/upcoming")
def upcoming_tasks(user_id: str = Depends(get_current_user)):
    return get_upcoming_tasks(user_id)


# ---------------------------------------------------
# GET SINGLE TASK (MUST BE LAST)
# ---------------------------------------------------
@router.get("/{task_id}")
def get_single_task(task_id: str, user_id: str = Depends(get_current_user)):

    task = get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    return task


# ---------------------------------------------------
# UPDATE TASK STATUS
# ---------------------------------------------------
@router.put("/status/{task_id}")
def update_status(task_id: str, data: dict, request: Request, user_id: str = Depends(get_current_user)):

    status = data.get("status")
    if status not in ["todo", "inprogress", "completed", "blocked"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    task = get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    update_task(task_id, {"status": status})

    log_activity({
        "user_id": user_id,
        "action": "task_status_change",
        "description": f"Changed status to {status} for task {task_id}",
        "device": request.headers.get("User-Agent"),
        "ip": request.client.host,
    })

    return {"message": "Status updated"}

from fastapi.responses import StreamingResponse
from io import StringIO, BytesIO
import csv
from reportlab.pdfgen import canvas
from app.auth.jwt_handler import decode_access_token


# ---------------------------------------------------
# READ USER FROM TOKEN
# ---------------------------------------------------
def get_user_from_token(request: Request):
    token = request.query_params.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    payload = decode_access_token(token)
    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    return user_id


# ---------------------------------------------------
# EXPORT CSV
# ---------------------------------------------------
@router.get("/export/csv")
def export_csv(request: Request):

    user_id = get_user_from_token(request)
    tasks = get_tasks_by_user(user_id)

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Title", "Description", "Priority", "Date", "Status"])

    for t in tasks:
        writer.writerow([
            t["title"],
            t.get("description", ""),
            t["priority"],
            t.get("date", ""),
            t.get("status", "")
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition":
                 "attachment; filename=tasks.csv"}
    )


# ---------------------------------------------------
# EXPORT PDF
# ---------------------------------------------------
@router.get("/export/pdf")
def export_pdf(request: Request):

    user_id = get_user_from_token(request)
    tasks = get_tasks_by_user(user_id)

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer)
    pdf.setFont("Helvetica", 12)

    y = 800
    pdf.drawString(50, y, "Task Report")
    y -= 40

    for t in tasks:
        pdf.drawString(
            50, y, 
            f"{t['title']} | {t['priority']} | {t['status']}"
        )
        y -= 20

    pdf.save()
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition":
                 "attachment; filename=tasks.pdf"}
    )
