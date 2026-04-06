# ──────────────────────────────────────────────────────────────────────────────
# Brain MRI Tumor Detector — Backend Dockerfile
# ──────────────────────────────────────────────────────────────────────────────
# Build context: VR-Project/   (project root, one level UP from backend/)
#
# docker build -f backend/Dockerfile -t brain-mri-backend .
# docker run -p 8000:8000 -v "$(pwd)/best_model.pth:/app/best_model.pth" brain-mri-backend
# ──────────────────────────────────────────────────────────────────────────────

FROM python:3.11-slim

# System deps for OpenCV headless & torch
RUN apt-get update && apt-get install -y --no-install-recommends \
        libglib2.0-0 \
        libsm6 \
        libxrender1 \
        libxext6 \
        libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first (layer caching)
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./

# Copy model weights from project root
COPY best_model.pth ./best_model.pth

# Expose port
EXPOSE 8000

# ── Environment ────────────────────────────────
ENV WEIGHTS_PATH=/app/best_model.pth
ENV ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# ── Run ────────────────────────────────────────
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
