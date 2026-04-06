from torchvision import transforms

def get_train_transforms():
    return transforms.Compose([
        transforms.Resize((224,224)),

        # 🔹 Safe augmentations
        transforms.RandomHorizontalFlip(p=0.5),

        transforms.RandomRotation(10),  # small rotation only

        transforms.RandomAffine(
            degrees=5,
            translate=(0.05, 0.05),   # slight shift
            scale=(0.95, 1.05)        # slight zoom
        ),

        transforms.ColorJitter(
            brightness=0.1,
            contrast=0.1
        ),

        # 🔹 Convert to tensor
        transforms.ToTensor(),

        # 🔹 Normalize (ImageNet standard for DenseNet)
        transforms.Normalize(
            mean=[0.485,0.456,0.406],
            std=[0.229,0.224,0.225]
        )
    ])


def get_test_transforms():
    return transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485,0.456,0.406],
            std=[0.229,0.224,0.225]
        )
    ])