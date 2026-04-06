import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

sender_email = "saimahesh200509@gmail.com"
app_password = "fxtl nocy kblz punv"

msg_owner = MIMEMultipart()
msg_owner['From'] = sender_email
msg_owner['To'] = sender_email
msg_owner['Subject'] = f"Test Email from Antigravity"
msg_owner.attach(MIMEText("If you get this, SMTP works!", 'plain'))

try:
    print("Connecting to smtp.gmail.com on port 465...")
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
        server.set_debuglevel(1)
        print("Logging in...")
        server.login(sender_email, app_password)
        print("Sending message...")
        server.send_message(msg_owner)
        print("SUCCESS! The email was sent successfully.")
except Exception as exc:
    print(f"FAILED: {exc}")
