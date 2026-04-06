import torch
import torch.nn as nn
import cv2
import numpy as np
import matplotlib.pyplot as plt


# ==============================
# 🔧 FIX 1: Remove inplace ReLU
# ==============================
def remove_inplace_relu(model):
    for module in model.modules():
        if isinstance(module, nn.ReLU):
            module.inplace = False


# ==============================
# 🔥 Grad-CAM Class
# ==============================
class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer

        self.gradients = None
        self.activations = None

        # ✅ Forward hook
        self.target_layer.register_forward_hook(self.forward_hook)

        # ✅ Correct backward hook
        self.target_layer.register_full_backward_hook(self.backward_hook)

    def forward_hook(self, module, input, output):
        self.activations = output

    def backward_hook(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def generate(self, input_tensor, class_idx=None):
        self.model.eval()

        # ✅ Enable gradients
        input_tensor.requires_grad = True

        # Forward pass
        output = self.model(input_tensor)

        # Get predicted class if not provided
        if class_idx is None:
            class_idx = torch.argmax(output, dim=1).item()

        loss = output[0, class_idx]

        # Backward pass
        self.model.zero_grad()
        loss.backward()

        # ✅ Safety check
        if self.gradients is None:
            raise ValueError("Gradients not captured!")

        gradients = self.gradients[0]      # (C, H, W)
        activations = self.activations[0]  # (C, H, W)

        # Global Average Pooling
        weights = torch.mean(gradients, dim=(1, 2))

        # Create CAM
        cam = torch.zeros(activations.shape[1:], dtype=torch.float32)

        for i, w in enumerate(weights):
            cam += w * activations[i]

        cam = torch.relu(cam)
        cam = cam.detach().cpu().numpy()

        # Resize to image size
        cam = cv2.resize(cam, (224, 224))

        # Normalize (avoid division by zero)
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)

        return cam


# ==============================
# 🎯 Apply Grad-CAM
# ==============================
def apply_gradcam(model, image_path, transform, save_path="gradcam_output.jpg"):
    # 🔥 Fix inplace issue
    remove_inplace_relu(model)

    # Read image
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    from PIL import Image
    image_pil = Image.fromarray(image_rgb)

    # Transform
    input_tensor = transform(image_pil).unsqueeze(0)

    # ✅ Best layer for DenseNet
    target_layer = model.features.denseblock4

    # GradCAM object
    gradcam = GradCAM(model, target_layer)

    # Generate heatmap
    cam = gradcam.generate(input_tensor)

    # Convert to heatmap
    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

    # Overlay
    overlay = heatmap * 0.4 + image_rgb * 0.6
    overlay = np.uint8(overlay)

    # Show & save
    plt.imshow(overlay)
    plt.axis('off')
    plt.savefig(save_path, bbox_inches='tight')
    plt.show()

    print(f"Grad-CAM saved at: {save_path}")