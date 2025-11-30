import smtplib
from email.mime.text import MIMEText

SMTP_EMAIL = "aditya639036@gmail.com"
SMTP_PASSWORD = "lans yhwr bwsg ylsh"

def send_otp_email(to_email, otp):
    msg = MIMEText(f"Your password reset OTP is: {otp}\nValid for 10 minutes.")
    msg["Subject"] = "Password Reset OTP"
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        print("Email Error:", e)
