import torch.nn as nn
from torchvision.models import densenet121
from config import NUM_CLASSES

def build_model():
    model = densenet121(pretrained=True)

    for param in model.features.parameters():
        param.requires_grad = False  # freeze backbone

    in_features = model.classifier.in_features
    model.classifier = nn.Linear(in_features, NUM_CLASSES)

    return model