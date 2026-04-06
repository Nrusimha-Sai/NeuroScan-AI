"""
model_utils.py
--------------
Handles model loading (once at startup) and single-image inference.
"""

import io
import base64
import logging
from pathlib import Path
from typing import Dict, Tuple

import cv2
import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from torchvision.models import densenet121
from torchvision import transforms

logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────
# Constants
# ──────────────────────────────────────────────
CLASSES = ["Glioma", "Meningioma", "No-tumor", "Pituitary"]
NUM_CLASSES = 4
IMAGE_SIZE = 224
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ImageNet normalisation used during training
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]

# Severity mapping
SEVERITY_MAP = {
    "Glioma":    ("high",   "Glioma is a type of tumour that occurs in the brain and spinal cord. "
                            "It is one of the most common brain tumours and can be aggressive."),
    "Meningioma":("medium", "Meningioma is a tumour arising from the meninges. "
                            "It is usually slow-growing and often benign, but monitoring is advised."),
    "No-tumor":  ("none",   "No tumour detected in the provided MRI scan. "
                            "The brain tissue appears normal based on the model analysis."),
    "Pituitary": ("low",    "A pituitary tumour is an abnormal growth in the pituitary gland. "
                            "Most pituitary tumours are benign (non-cancerous) adenomas."),
}


# ──────────────────────────────────────────────
# Transforms (test / inference only)
# ──────────────────────────────────────────────
def get_inference_transform() -> transforms.Compose:
    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


# ──────────────────────────────────────────────
# Model builder  (mirrors model.py exactly)
# ──────────────────────────────────────────────
def build_model() -> nn.Module:
    model = densenet121(weights=None)          # weights loaded from .pth

    # Freeze backbone (same architecture as training)
    for param in model.features.parameters():
        param.requires_grad = False

    in_features = model.classifier.in_features
    model.classifier = nn.Linear(in_features, NUM_CLASSES)
    return model


# ──────────────────────────────────────────────
# Load weights
# ──────────────────────────────────────────────
def load_model(weights_path: str) -> nn.Module:
    path = Path(weights_path)
    if not path.exists():
        raise FileNotFoundError(f"Model weights not found at: {path.resolve()}")

    model = build_model()
    state_dict = torch.load(path, map_location=DEVICE)

    # Handle DataParallel checkpoints (keys start with "module.")
    if any(k.startswith("module.") for k in state_dict.keys()):
        state_dict = {k.replace("module.", ""): v for k, v in state_dict.items()}

    model.load_state_dict(state_dict)
    model.to(DEVICE)
    model.eval()
    logger.info(f"✅ Model loaded from {path.resolve()} on {DEVICE}")
    return model


# ──────────────────────────────────────────────
# Image helpers
# ──────────────────────────────────────────────
def pil_to_base64(img: Image.Image, fmt: str = "JPEG") -> str:
    """Convert a PIL image to a base64-encoded string."""
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    return base64.b64encode(buf.getvalue()).decode("utf-8")


def numpy_to_base64(arr: np.ndarray, fmt: str = "JPEG") -> str:
    """Convert an RGB numpy array (uint8) to base64."""
    img = Image.fromarray(arr.astype(np.uint8))
    return pil_to_base64(img, fmt)


def read_image_from_bytes(raw_bytes: bytes) -> Tuple[Image.Image, np.ndarray]:
    """
    Read image bytes → (PIL RGB image, numpy RGB array).
    Supports JPEG, PNG, TIFF, BMP.
    """
    nparr = np.frombuffer(raw_bytes, np.uint8)
    bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if bgr is None:
        raise ValueError("Could not decode image. Ensure it is a valid JPEG/PNG/TIFF file.")

    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(rgb)
    return pil_img, rgb


# ──────────────────────────────────────────────
# Inference
# ──────────────────────────────────────────────
def run_inference(
    model: nn.Module,
    pil_image: Image.Image,
) -> Dict:
    """
    Run a forward pass and return prediction + all-class probabilities.

    Returns
    -------
    {
        "prediction":        str,
        "confidence":        float,
        "all_probabilities": {class: float, ...},
        "class_idx":         int,
    }
    """
    transform = get_inference_transform()
    tensor = transform(pil_image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        outputs = model(tensor)
        probs   = torch.softmax(outputs, dim=1)[0]

    confidence, class_idx = probs.max(0)
    class_idx  = class_idx.item()
    confidence = confidence.item()

    all_probs = {cls: round(probs[i].item(), 6) for i, cls in enumerate(CLASSES)}

    return {
        "prediction":        CLASSES[class_idx],
        "confidence":        round(confidence, 6),
        "all_probabilities": all_probs,
        "class_idx":         class_idx,
    }
