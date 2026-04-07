import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

logger = logging.getLogger("brain_mri_api")

# Hardcoded from test_smtp.py or read from env
SENDER_EMAIL = os.getenv("SMTP_EMAIL", "saimahesh200509@gmail.com")
APP_PASSWORD = os.getenv("SMTP_PASSWORD", "fxtl nocy kblz punv")

def send_contact_emails(name: str, email: str, subject: str, message: str) -> None:
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
            server.login(SENDER_EMAIL, APP_PASSWORD)

            # 1. Send the email to the admin/website owner
            msg_admin = MIMEMultipart()
            msg_admin['From'] = SENDER_EMAIL
            msg_admin['To'] = SENDER_EMAIL
            msg_admin['Reply-To'] = email
            msg_admin['Subject'] = f"NeuroScan AI Contact Form: {subject}"
            
            admin_body = f"Message received from: {name} ({email})\n\nSubject: {subject}\n\nMessage:\n--------------------------------------------------\n{message}\n--------------------------------------------------"
            msg_admin.attach(MIMEText(admin_body, 'plain'))
            
            server.send_message(msg_admin)
            
            # 2. Send the autoresponse to the user's entered email
            msg_user = MIMEMultipart()
            msg_user['From'] = SENDER_EMAIL
            msg_user['To'] = email
            msg_user['Subject'] = f"Re: {subject} - Request Received"
            
            user_body = f"Hi {name},\n\nThank you for reaching out to us. We have received your message regarding \"{subject}\" and will get back to you as soon as possible.\n\nHere is a copy of your message:\n--------------------------------------------------\n{message}\n--------------------------------------------------\n\nBest regards,\nThe NeuroScan AI Team"
            msg_user.attach(MIMEText(user_body, 'plain'))
            
            server.send_message(msg_user)
            
            logger.info(f"Contact emails sent successfully for submission from {email}")
            
    except Exception as exc:
        logger.error(f"Failed to send email: {exc}", exc_info=True)
        raise exc
