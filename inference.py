import torch
import cv2
import tkinter as tk
from tkinter import filedialog
from PIL import Image
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader

from config import *
from preprocess import get_test_transforms
from gradcam import apply_gradcam

# Class labels
classes = ['Glioma', 'Meningioma', 'No-tumor', 'Pituitary']


# =========================
# 🔹 EVALUATION FUNCTION
# =========================
def evaluate(model):

    print("\n===== TESTING STARTED =====")

    dataset = ImageFolder(TEST_PATH, transform=get_test_transforms())
    loader = DataLoader(dataset, batch_size=32)

    correct, total = 0, 0

    model.eval()

    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)

            outputs = model(images)
            _, preds = torch.max(outputs, 1)

            correct += (preds == labels).sum().item()
            total += labels.size(0)

    acc = correct / total

    print(f"\nFinal Test Accuracy: {acc:.4f}")

    with open("final_results.txt", "w") as f:
        f.write(f"Test Accuracy: {acc:.4f}\n")

    print("Results saved to final_results.txt")


# =========================
# 🔹 FILE SELECTOR
# =========================
def select_image():
    root = tk.Tk()
    root.withdraw()
    root.attributes('-topmost', True)  # bring dialog to front

    file_path = filedialog.askopenfilename(
        title="Select MRI Image",
        filetypes=[("Image Files", "*.jpg *.jpeg *.png")]
    )

    root.destroy()
    return file_path


# =========================
# 🔹 PREDICTION + GRADCAM
# =========================
def predict_and_explain(model):

    print("\n===== SELECT IMAGE FOR PREDICTION =====")

    image_path = select_image()

    if not image_path:
        print("❌ No file selected")
        return

    print(f"Selected Image: {image_path}")

    transform = get_test_transforms()

    # Load image
    image = cv2.imread(image_path)
    if image is None:
        print("❌ Failed to load image")
        return

    # Convert BGR → RGB → PIL
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_pil = Image.fromarray(image_rgb)

    # Transform
    input_tensor = transform(image_pil).unsqueeze(0).to(DEVICE)

    model.eval()

    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        confidence, pred = torch.max(probabilities, 1)

    pred_label = classes[pred.item()]

    print(f"\nPrediction: {pred_label}")
    print(f"Confidence: {confidence.item():.4f}")
    if pred_label == "No-tumor":
        return
    # 🔥 Grad-CAM visualization
    apply_gradcam(model, image_path, transform)