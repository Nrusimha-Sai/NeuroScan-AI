from model import build_model
from inference import evaluate, predict_and_explain
from config import *

import torch

print("🚀 VR Project Started")
print("===== LOADING TRAINED MODEL =====")

model = build_model()
model.load_state_dict(torch.load("best_model.pth", map_location=DEVICE))
model.to(DEVICE)

print("Model loaded successfully ✅")

# Run evaluation
# evaluate(model)

# Run single prediction + GradCAM
predict_and_explain(model)