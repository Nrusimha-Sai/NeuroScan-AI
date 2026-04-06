# ─────────────────────────────────────────────
# Brain MRI Tumor Detector — Backend Dockerfile
# ─────────────────────────────────────────────

FROM python:3.11-slim

# Install system dependencies (for OpenCV + Torch)
RUN apt-get update && apt-get install -y --no-install-recommends \
        libglib2.0-0 \
        libsm6 \
        libxrender1 \
        libxext6 \
        libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first (for caching)
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy model
COPY best_model.pth ./best_model.pth

# Environment variables
ENV WEIGHTS_PATH=/app/best_model.pth
ENV ALLOWED_ORIGINS=*

# Expose port (not mandatory but good practice)
EXPOSE 8000

# Run app (IMPORTANT FIX for Render)
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]