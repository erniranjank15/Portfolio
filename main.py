import os
import requests
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="Portfolio Contact API",
    description="Backend API for handling portfolio contact form submissions via Brevo",
    version="1.0.0"
)

# Configure CORS so your frontend can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Portfolio Contact API is running."}

@app.post("/api/contact")
def send_contact_email(payload: ContactRequest):
    brevo_api_key = os.getenv("BREVO_API_KEY")
    sender_email = os.getenv("SENDER_EMAIL")
    sender_name = os.getenv("SENDER_NAME", "Niranjan Kasote")
    my_notification_email = os.getenv("RECIPIENT_EMAIL", "kasoteniranjan23@gmail.com")

    if not brevo_api_key or "your_actual_brevo_api_key_here" in brevo_api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Brevo API key is not configured. Please set BREVO_API_KEY in .env file."
        )

    brevo_endpoint = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": brevo_api_key,
        "content-type": "application/json"
    }

    # Format the email content
    formatted_message = payload.message.replace("\n", "<br>")

    # 1. Main Notification email sent TO YOU (so you know who sent the inquiry)
    admin_email_data = {
        "sender": {
            "name": payload.name,  # Shows the user's name as the sender in your inbox
            "email": sender_email  # Brevo verified sender address
        },
        "to": [
            {
                "email": my_notification_email,
                "name": "Niranjan Kasote"
            }
        ],
        "replyTo": {
            "email": payload.email,
            "name": payload.name
        },
        "subject": f"Inquiry from {payload.name}: Portfolio Contact",
        "htmlContent": f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #4f46e5; color: #ffffff; padding: 20px; text-align: center;">
                    <h2 style="margin: 0; font-size: 20px;">New Message from {payload.name}</h2>
                </div>
                <div style="padding: 24px;">
                    <p style="margin: 0 0 10px 0;"><strong>Sender Name:</strong> {payload.name}</p>
                    <p style="margin: 0 0 10px 0;"><strong>Sender Email:</strong> <a href="mailto:{payload.email}">{payload.email}</a></p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
                    <div style="background-color: #f9fafb; border-left: 4px solid #4f46e5; padding: 12px 16px; margin: 0; font-size: 14px; white-space: pre-wrap;">
                        {formatted_message}
                    </div>
                </div>
                <div style="background-color: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
                    Clicking 'Reply' will respond directly to {payload.name} ({payload.email})
                </div>
            </div>
        """
    }

    # 2. Automated acknowledgment email sent TO THE USER
    user_email_data = {
        "sender": {
            "name": "Niranjan Kasote",
            "email": sender_email
        },
        "to": [
            {
                "email": payload.email,
                "name": payload.name
            }
        ],
        "replyTo": {
            "email": my_notification_email,
            "name": "Niranjan Kasote"
        },
        "subject": f"Thanks for reaching out, {payload.name}!",
        "htmlContent": f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #4f46e5; color: #ffffff; padding: 20px; text-align: center;">
                    <h2 style="margin: 0; font-size: 20px;">Thank You for Reaching Out!</h2>
                </div>
                <div style="padding: 24px;">
                    <p>Hi <strong>{payload.name}</strong>,</p>
                    <p>Thank you for getting in touch through my portfolio. I have received your message and will get back to you as soon as possible.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="margin: 0 0 8px 0; font-weight: bold; color: #555;">Your message:</p>
                    <div style="background-color: #f9fafb; border-left: 4px solid #4f46e5; padding: 12px 16px; margin: 0; font-size: 14px; white-space: pre-wrap;">
                        {formatted_message}
                    </div>
                    <br>
                    <p>Best regards,<br><strong>Niranjan Kasote</strong></p>
                </div>
            </div>
        """
    }

    try:
        # Send email to your inbox first
        admin_response = requests.post(brevo_endpoint, json=admin_email_data, headers=headers, timeout=10)

        # Send confirmation copy to user
        requests.post(brevo_endpoint, json=user_email_data, headers=headers, timeout=10)

        if admin_response.status_code in (200, 201):
            return {
                "status": "success",
                "message": "Your message has been sent successfully!"
            }
        else:
            try:
                error_data = admin_response.json()
                detail_msg = error_data.get("message", admin_response.text)
            except Exception:
                detail_msg = admin_response.text

            raise HTTPException(
                status_code=admin_response.status_code,
                detail=f"Brevo API error: {detail_msg}"
            )

    except requests.RequestException as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to connect to email service: {str(exc)}"
        )

