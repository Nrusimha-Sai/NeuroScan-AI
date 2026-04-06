"""
gradcam_utils.py
----------------
Grad-CAM implementation adapted for API use.
Returns a base64-encoded heatmap overlay instead of saving to disk.
"""

import cv2
import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from typing import Optional


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────
def _remove_inplace_relu(model: nn.Module) -> None:
    """Set all ReLU inplace=False so backward hooks work correctly."""
    for module in model.modules():
        if isinstance(module, nn.ReLU):
            module.inplace = False


# ──────────────────────────────────────────────
# Grad-CAM
# ──────────────────────────────────────────────
class GradCAM:
    """
    Gradient-weighted Class Activation Mapping.

    Hooks into a target layer and captures activations + gradients
    during a forward/backward pass.
    """

    def __init__(self, model: nn.Module, target_layer: nn.Module):
        self.model        = model
        self.target_layer = target_layer
        self.activations: Optional[torch.Tensor] = None
        self.gradients:   Optional[torch.Tensor] = None

        self._fwd_hook = target_layer.register_forward_hook(self._save_activations)
        self._bwd_hook = target_layer.register_full_backward_hook(self._save_gradients)

    def _save_activations(self, module, inp, out):
        self.activations = out.detach()

    def _save_gradients(self, module, grad_in, grad_out):
        self.gradients = grad_out[0].detach()

    def remove_hooks(self):
        self._fwd_hook.remove()
        self._bwd_hook.remove()

    def generate(
        self,
        input_tensor: torch.Tensor,
        class_idx: Optional[int] = None,
    ) -> np.ndarray:
        """
        Generate CAM for `class_idx` (or predicted class if None).

        Returns
        -------
        np.ndarray  float32, shape (IMAGE_SIZE, IMAGE_SIZE), values in [0, 1]
        """
        self.model.eval()

        # Need gradients for Grad-CAM
        input_tensor = input_tensor.clone().requires_grad_(True)

        output = self.model(input_tensor)

        if class_idx is None:
            class_idx = torch.argmax(output, dim=1).item()

        # Backward on the target class score
        self.model.zero_grad()
        score = output[0, class_idx]
        score.backward()

        if self.gradients is None or self.activations is None:
            raise RuntimeError("Grad-CAM hooks did not fire. Check the target layer.")

        # Global Average Pooling of gradients → channel weights
        weights      = self.gradients[0].mean(dim=(1, 2))   # (C,)
        activations  = self.activations[0]                   # (C, H, W)

        # Weighted sum of activations
        cam = torch.zeros(activations.shape[1:], dtype=torch.float32)
        for i, w in enumerate(weights):
            cam += w * activations[i]

        cam = torch.relu(cam).cpu().numpy()

        # Resize to input image size
        cam = cv2.resize(cam, (224, 224))

        # Normalise to [0, 1]
        cam_min, cam_max = cam.min(), cam.max()
        cam = (cam - cam_min) / (cam_max - cam_min + 1e-8)

        return cam


# ──────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────
def generate_gradcam_overlay(
    model:        nn.Module,
    pil_image:    Image.Image,
    transform,
    class_idx:    Optional[int] = None,
    alpha:        float = 0.45,
) -> np.ndarray:
    """
    Full Grad-CAM pipeline.

    Parameters
    ----------
    model       : loaded PyTorch model
    pil_image   : PIL RGB image (original, not yet transformed)
    transform   : torchvision inference transforms
    class_idx   : class to visualise (None → predicted class)
    alpha       : heatmap blend ratio (higher = more heatmap)

    Returns
    -------
    np.ndarray  uint8 RGB overlay (224 × 224 × 3)
    """
    # Fix inplace ReLU before hooking
    _remove_inplace_relu(model)

    # ── Prepare input tensor
    device       = next(model.parameters()).device
    input_tensor = transform(pil_image).unsqueeze(0).to(device)

    # ── Target layer: denseblock4 (same as original gradcam.py)
    target_layer = model.features.denseblock4

    gradcam = GradCAM(model, target_layer)
    try:
        cam = gradcam.generate(input_tensor, class_idx=class_idx)
    finally:
        gradcam.remove_hooks()

    # ── Prepare original image (resize to 224×224)
    original_resized = np.array(pil_image.resize((224, 224))).astype(np.float32)

    # ── Convert CAM → JET colour heatmap
    heatmap_bgr = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    heatmap_rgb = cv2.cvtColor(heatmap_bgr, cv2.COLOR_BGR2RGB).astype(np.float32)

    # ── Overlay
    overlay = heatmap_rgb * alpha + original_resized * (1 - alpha)
    overlay = np.clip(overlay, 0, 255).astype(np.uint8)

    return overlay
