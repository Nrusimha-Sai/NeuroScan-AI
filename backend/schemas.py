from pydantic import BaseModel
from typing import Dict, Optional


class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    all_probabilities: Dict[str, float]
    gradcam_image: Optional[str] = None  # base64-encoded JPEG
    original_image: str                  # base64-encoded original (resized)
    has_tumor: bool
    severity: str                        # "none" | "low" | "medium" | "high"
    description: str                     # Short clinical description


class ErrorResponse(BaseModel):
    detail: str
    error_code: str


class ContactRequest(BaseModel):
    name: str
    email: str
    subject: str
    message: str


class ContactResponse(BaseModel):
    success: bool
    message: str
