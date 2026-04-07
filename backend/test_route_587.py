import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

sender_email = "saimahesh200509@gmail.com"
app_password = "fxtl nocy kblz punv"

try:
    print("Testing sending on 587...")
    msg_owner = MIMEMultipart()
    msg_owner['From'] = sender_email
    msg_owner['To'] = sender_email
    msg_owner['Reply-To'] = "testuser@example.com"
    msg_owner['Subject'] = f"New Contact: Issue"
    body_owner = f"Name: John\nEmail: testuser@example.com\nSubject: Issue\n\nMessage:\nHelp"
    msg_owner.attach(MIMEText(body_owner, 'plain'))

    with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as server:
        server.set_debuglevel(1)
        server.starttls()
        server.login(sender_email, app_password)
        server.send_message(msg_owner)
    print("Success 587!")
except Exception as e:
    import traceback
    traceback.print_exc()

