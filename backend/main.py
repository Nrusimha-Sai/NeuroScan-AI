"""
main.py
-------
FastAPI application entry point for Brain MRI Tumor Detection.

Endpoints
---------
GET  /          → health check
GET  /health    → detailed health (model status, device)
POST /predict   → upload MRI image → prediction + Grad-CAM
"""

import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

import torch
from fastapi import FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from gradcam_utils import generate_gradcam_overlay
from model_utils import (
    DEVICE,
    SEVERITY_MAP,
    get_inference_transform,
    load_model,
    numpy_to_base64,
    pil_to_base64,
    read_image_from_bytes,
    run_inference,
)
from schemas import ErrorResponse, PredictionResponse, ContactRequest
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ──────────────────────────────────────────────
# Logging
# ──────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s - %(message)s",
)
logger = logging.getLogger("brain_mri_api")

# ──────────────────────────────────────────────
# Model weights path
# Looks for best_model.pth in:
#   1. WEIGHTS_PATH env var
#   2. ../best_model.pth  (project root, one level up from backend/)
# ──────────────────────────────────────────────
_DEFAULT_WEIGHTS = Path(__file__).parent.parent / "best_model.pth"
WEIGHTS_PATH = Path(os.getenv("WEIGHTS_PATH", str(_DEFAULT_WEIGHTS)))

# Global model holder
_model = None


# ──────────────────────────────────────────────
# Lifespan: load model once on startup
# ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global _model
    logger.info(f"🚀 Loading model from: {WEIGHTS_PATH}")
    try:
        _model = load_model(str(WEIGHTS_PATH))
        logger.info("✅ Model ready for inference")
    except FileNotFoundError as exc:
        logger.error(f"❌ {exc}")
        logger.error("Server will start but /predict will return 503 until weights are available.")
    yield
    # Cleanup (if needed)
    _model = None
    logger.info("🛑 Model unloaded, server shutting down")


# ──────────────────────────────────────────────
# FastAPI app
# ──────────────────────────────────────────────
app = FastAPI(
    title="Brain MRI Tumor Detector",
    description=(
        "Upload a brain MRI scan (JPEG/PNG) and receive an AI-powered "
        "tumour classification with Grad-CAM explainability heatmap."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────
ALLOWED_ORIGINS = [
    "https://neuro-scan-ai.netlify.app",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Validation helpers
# ──────────────────────────────────────────────
ALLOWED_CONTENT_TYPES = {
    "image/jpeg", "image/jpg", "image/png",
    "image/tiff", "image/bmp", "image/webp",
}
MAX_FILE_SIZE_MB = 20
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


def _validate_upload(file: UploadFile) -> None:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type '{file.content_type}'. "
                   f"Accepted: JPEG, PNG, TIFF, BMP, WEBP.",
        )


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────
@app.get("/", summary="Root health check")
async def root():
    return {
        "status": "ok",
        "message": "Brain MRI Tumor Detection API is running 🧠",
        "docs": "/docs",
    }


@app.post("/contact", summary="Submit contact form")
async def contact_form(request: ContactRequest):
    sender_email = "support.neuroscan.ai@gmail.com"
    app_password = "lbgl hhgl apkf bdbg"

    try:
        # Send message to site owner
        msg_owner = MIMEMultipart("alternative")
        msg_owner['From'] = sender_email
        msg_owner['To'] = sender_email
        msg_owner['Reply-To'] = request.email
        msg_owner['Subject'] = f"New Inquiry: {request.subject}"
        
        html_owner = f"""
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f1f5f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; padding: 30px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-top: 5px solid #3b82f6;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://neuro-scan-ai.netlify.app/favicon.svg" alt="NeuroScan AI Logo" width="50" style="display: block; margin: 0 auto 10px auto;">
                </div>
                <h2 style="color: #1e293b; margin-top: 0; text-align: center;">New Contact Request</h2>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;">
                <p style="color: #475569;"><strong>From:</strong> {request.name}</p>
                <p style="color: #475569;"><strong>Email:</strong> <a href="mailto:{request.email}" style="color: #3b82f6;">{request.email}</a></p>
                <p style="color: #475569;"><strong>Subject:</strong> {request.subject}</p>
                <h3 style="color: #1e293b; margin-top: 30px;">Message:</h3>
                <div style="background-color: #f8fafc; padding: 20px; border-left: 4px solid #3b82f6; border-radius: 6px; color: #334155; white-space: pre-wrap; font-size: 15px;">{request.message}</div>
                <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 40px;">System generated by NeuroScan AI Backend</p>
            </div>
          </body>
        </html>
        """
        msg_owner.attach(MIMEText(html_owner, 'html'))

        # Send autoresponse to the user
        msg_user = MIMEMultipart("alternative")
        msg_user['From'] = sender_email
        msg_user['To'] = request.email
        msg_user['Subject'] = "Receipt: " + request.subject
        
        html_user = f"""
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px;">
            <div style="max-width: 600px; margin: auto; padding: 40px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.1); border-top: 6px solid #8b5cf6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://neuro-scan-ai.netlify.app/favicon.svg" alt="NeuroScan AI Brain Logo" width="60" style="display: block; margin: 0 auto 15px auto;">
                    <h1 style="color: #8b5cf6; margin: 0; font-size: 28px;">NeuroScan AI</h1>
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px;">Request Confirmation</p>
                </div>
                <p style="color: #334155; font-size: 17px;">Hi <strong>{request.name}</strong>,</p>
                <p style="color: #475569; font-size: 15px; line-height: 1.6;">Thank you for reaching out to us! We have successfully received your message regarding <strong>"{request.subject}"</strong>.</p>
                <p style="color: #475569; font-size: 15px; line-height: 1.6;">Our team will review your inquiry and get back to you to assist you shortly.</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin: 30px 0;">
                    <p style="margin: 0; color: #64748b; font-size: 14px; font-style: italic;">Your Message:</p>
                    <p style="margin: 10px 0 0 0; color: #475569; white-space: pre-wrap; font-size: 15px;">"{request.message}"</p>
                </div>
                
                <p style="color: #334155; font-size: 15px; margin-top: 30px;">Best regards,<br><span style="font-weight: bold; color: #8b5cf6;">The NeuroScan AI Team</span></p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 40px;">
                <p style="font-size: 13px; color: #94a3b8; text-align: center;">Visit our <a href="https://neuro-scan-ai.netlify.app" style="color: #8b5cf6; text-decoration: none; font-weight: 500;">WebApp</a> • Check our <a href="https://github.com/Nrusimha-Sai/NeuroScan-AI" style="color: #8b5cf6; text-decoration: none; font-weight: 500;">GitHub</a></p>
            </div>
          </body>
        </html>
        """
        msg_user.attach(MIMEText(html_user, 'html'))

        with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as server:
            server.starttls()
            server.login(sender_email, app_password)
            server.send_message(msg_owner)
            server.send_message(msg_user)

        return {"success": True, "message": "Email sent successfully"}
    except Exception as exc:
        logger.error(f"Failed to send email: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send email"
        )


@app.get("/health", summary="Detailed health check")
async def health():
    return {
        "status": "ok" if _model is not None else "degraded",
        "model_loaded": _model is not None,
        "device": str(DEVICE),
        "weights_path": str(WEIGHTS_PATH),
        "cuda_available": torch.cuda.is_available(),
    }


@app.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict tumour type from brain MRI",
    description=(
        "Upload a brain MRI image (JPEG / PNG). "
        "Returns the predicted tumour class, confidence, per-class probabilities, "
        "and a Grad-CAM heatmap overlay as a base64-encoded JPEG string."
    ),
    responses={
        200: {"model": PredictionResponse},
        400: {"model": ErrorResponse},
        415: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
    },
)
async def predict(
    file: UploadFile = File(..., description="Brain MRI image (JPEG/PNG, max 20 MB)"),
    gradcam: Optional[bool] = True,
):
    # ── Model availability ────────────────────
    if _model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model weights not loaded. Check server logs.",
        )

    # ── File type validation ──────────────────
    _validate_upload(file)

    # ── Read raw bytes ────────────────────────
    raw_bytes = await file.read()
    if len(raw_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds {MAX_FILE_SIZE_MB} MB limit.",
        )
    if len(raw_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    # ── Decode image ──────────────────────────
    try:
        pil_image, rgb_array = read_image_from_bytes(raw_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    logger.info(f"📷 Image received: {file.filename}  size={len(raw_bytes)//1024} KB")

    # ── Inference ─────────────────────────────
    try:
        result = run_inference(_model, pil_image)
    except Exception as exc:
        logger.error(f"Inference error: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference failed: {str(exc)}",
        )

    prediction = result["prediction"]
    severity, description = SEVERITY_MAP[prediction]

    logger.info(
        f"🔍 Prediction: {prediction} | "
        f"Confidence: {result['confidence']:.4f} | "
        f"Severity: {severity}"
    )

    # ── Original image (resized 224×224 → base64) ─────────────────
    from PIL import Image as PILImage
    original_resized = pil_image.resize((224, 224), PILImage.LANCZOS)
    original_b64 = pil_to_base64(original_resized, fmt="JPEG")

    # ── Grad-CAM ──────────────────────────────
    gradcam_b64: Optional[str] = None
    if gradcam and prediction != "No-tumor":
        try:
            transform = get_inference_transform()
            overlay   = generate_gradcam_overlay(
                model      = _model,
                pil_image  = pil_image,
                transform  = transform,
                class_idx  = result["class_idx"],
            )
            gradcam_b64 = numpy_to_base64(overlay, fmt="JPEG")
            logger.info("🔥 Grad-CAM generated successfully")
        except Exception as exc:
            logger.warning(f"Grad-CAM failed (non-fatal): {exc}", exc_info=True)
            gradcam_b64 = None
    elif prediction == "No-tumor":
        logger.info("ℹ️  No-tumor predicted — skipping Grad-CAM")

    return PredictionResponse(
        prediction        = prediction,
        confidence        = result["confidence"],
        all_probabilities = result["all_probabilities"],
        gradcam_image     = gradcam_b64,
        original_image    = original_b64,
        has_tumor         = prediction != "No-tumor",
        severity          = severity,
        description       = description,
    )

# ──────────────────────────────────────────────
# Global exception handler
# ──────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred.", "error_code": "INTERNAL_ERROR"},
    )
