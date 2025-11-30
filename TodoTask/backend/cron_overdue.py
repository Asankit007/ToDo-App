# FILE: cron_overdue.py

from datetime import datetime, timedelta
from app.database import users_collection, tasks_collection
from app.auth.email_utils import send_otp_email  # reuse existing email sender


def send_reminder_email(to_email: str, subject: str, body: str):
    """
    Wrapper so we don't touch your existing email config.
    We just reuse send_otp_email(to, otp_text).
    Here 'otp_text' will actually be our whole message.
    """
    send_otp_email(to_email, body)


def send_task_reminders():
    today = datetime.now().date()
    today_str = today.strftime("%Y-%m-%d")
    tomorrow_str = (today + timedelta(days=1)).strftime("%Y-%m-%d")

    print(f"[CRON] Running reminders for today = {today_str}, tomorrow = {tomorrow_str}")

    # Get all users
    users = list(users_collection.find({}))

    for user in users:
        user_id = str(user["_id"])
        email = user.get("email")
        name = user.get("name", "there")

        if not email:
            continue  # skip if no email

        # --------------------------
        # 1) Overdue tasks
        # --------------------------
        overdue_tasks = list(
            tasks_collection.find(
                {
                    "user_id": user_id,
                    "date": {"$lt": today_str},           # date before today
                    "status": {"$ne": "completed"},       # not completed
                }
            )
        )

        # --------------------------
        # 2) Tasks due tomorrow
        # --------------------------
        upcoming_tasks = list(
            tasks_collection.find(
                {
                    "user_id": user_id,
                    "date": tomorrow_str,                 # exactly tomorrow
                    "status": {"$ne": "completed"},
                }
            )
        )

        # If no tasks to remind about, skip this user
        if not overdue_tasks and not upcoming_tasks:
            continue

        # --------------------------
        # Build email content
        # --------------------------
        lines = []
        lines.append(f"Hi {name},")
        lines.append("")
        lines.append("Here are your task reminders from Task Manager:")
        lines.append("")

        if overdue_tasks:
            lines.append("🔴 Overdue tasks:")
            for t in overdue_tasks:
                title = t.get("title", "Untitled")
                date = t.get("date", "N/A")
                priority = t.get("priority", "N/A")
                lines.append(f"  • {title}  (Due: {date}, Priority: {priority})")
            lines.append("")

        if upcoming_tasks:
            lines.append(f"🟡 Tasks due tomorrow ({tomorrow_str}):")
            for t in upcoming_tasks:
                title = t.get("title", "Untitled")
                priority = t.get("priority", "N/A")
                lines.append(f"  • {title}  (Priority: {priority})")
            lines.append("")

        lines.append("Please open the app to update or complete these tasks. ✅")
        body = "\n".join(lines)

        subject = "Task Reminders: Overdue & Upcoming"

        # --------------------------
        # Send email
        # --------------------------
        send_reminder_email(email, subject, body)
        print(f"[CRON] Reminder email sent to {email}")


if __name__ == "__main__":
    send_task_reminders()
