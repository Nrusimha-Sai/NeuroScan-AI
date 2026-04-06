import torch
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(BASE_DIR, "Dataset")
TRAIN_PATH = os.path.join(DATASET_PATH, "Training")
TEST_PATH = os.path.join(DATASET_PATH, "Testing")

MODEL_SAVE_PATH = os.path.join(BASE_DIR, "best_model.pth")

NUM_CLASSES = 4
IMAGE_SIZE = 224
BATCH_SIZE = 32
LR = 1e-4
EPOCHS = 30

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")