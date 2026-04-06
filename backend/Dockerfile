# ─────────────────────────────────────────────
# Brain MRI Tumor Detector — Backend Dockerfile
# ─────────────────────────────────────────────

FROM python:3.11-slim

# Prevent Python from buffering logs
ENV PYTHONUNBUFFERED=1

# Install system dependencies (OpenCV + Torch)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# ─────────────────────────────────────────────
# Copy & install dependencies (cache optimized)
# ─────────────────────────────────────────────
COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# ─────────────────────────────────────────────
# Copy application code
# ─────────────────────────────────────────────
COPY backend/ .

# Copy model (from root)
COPY best_model.pth ./best_model.pth

# ─────────────────────────────────────────────
# Environment variables
# ─────────────────────────────────────────────
ENV WEIGHTS_PATH=/app/best_model.pth

# ⚠️ CORS handled via Render ENV (recommended)
# Example:
# ALLOWED_ORIGINS=https://neuro-scan-ai.netlify.app

# ─────────────────────────────────────────────
# Expose port (Render uses $PORT)
# ─────────────────────────────────────────────
EXPOSE 8000

# ─────────────────────────────────────────────
# Start FastAPI (Render compatible)
# ─────────────────────────────────────────────
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]