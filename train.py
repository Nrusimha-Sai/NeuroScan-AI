import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
from tqdm import tqdm

from config import *
from model import build_model
from preprocess import get_train_transforms, get_test_transforms

def train_model():

    print("\n===== TRAINING STARTED =====")

    model = build_model().to(DEVICE)

    train_dataset = ImageFolder(TRAIN_PATH, transform=get_train_transforms())
    val_dataset = ImageFolder(TEST_PATH, transform=get_test_transforms())

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.classifier.parameters(), lr=LR)

    best_acc = 0

    for epoch in range(EPOCHS):
        print(f"\nEpoch {epoch+1}/{EPOCHS}")

        # TRAIN
        model.train()
        correct, total = 0, 0

        for images, labels in tqdm(train_loader, desc=f"Epoch {epoch + 1}/{EPOCHS}"):
            images, labels = images.to(DEVICE), labels.to(DEVICE)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        train_acc = correct / total

        # VALIDATION
        model.eval()
        correct, total = 0, 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(DEVICE), labels.to(DEVICE)
                outputs = model(images)
                _, preds = torch.max(outputs,1)

                correct += (preds == labels).sum().item()
                total += labels.size(0)

        val_acc = correct / total

        print(f"Train Acc: {train_acc:.4f}")
        print(f"Val   Acc: {val_acc:.4f}")

        if val_acc > best_acc:
            best_acc = val_acc
            torch.save(model.state_dict(), MODEL_SAVE_PATH)
            print("✅ Model Saved")

    print("\n===== TRAINING COMPLETE =====")

    model.load_state_dict(torch.load(MODEL_SAVE_PATH))
    return model