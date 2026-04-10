# NeuroScan AI: Final Demonstration Script

## Team Role Division
| Name | Role | Responsibility |
| :--- | :--- | :--- |
| **Nrusimha Sai** | Team Lead | Introduction, Vision, Problem Statement, Future Scope, and Conclusion. |
| **Srinivas** | ML Engineer | Technical Architecture, Model Training, Grad-CAM (Explainability), and API logic. |
| **Durga** | UI/UX Developer | Frontend framework choice, Design system, Responsive UI, and Component structure. |
| **Roshini** | Product Presenter | Live Demo Walkthrough, User Flow, Validation, and Feature Highlights. |

---

## The Script

### 1. Introduction (Nrusimha Sai)
**[Starting the presentation - Hero Section Visible]**

"Good morning/afternoon everyone. I am Nrusimha Sai, the Team Lead for **NeuroScan AI**.

Every year, millions of people are diagnosed with brain abnormalities. For radiologists, analyzing hundreds of MRI slices daily is an exhausting and high-stakes task. A slight oversight can lead to a late diagnosis.

This is why we built **NeuroScan AI**. Our vision is to empower medical professionals with an AI-driven second opinion that is not just fast and accurate, but also **explainable**. We don't just tell you there is a tumor; we show you exactly where the AI sees it."

---

### 2. Technical Architecture (Srinivas)
**[Transition: Switching to slides showing the Architecture diagram]**

"Thank you, Nrusimha. I’m Srinivas, and I handled the backend and machine learning side of the project.

Our system is built on a high-performance **FastAPI** backend that serves a deep learning model developed in **PyTorch**. We utilized a Convolutional Neural Network (CNN) specifically tuned for medical imaging.

One of the biggest challenges in medical AI is the 'Black Box' problem—doctors often find it hard to trust a score without knowing why it was given. To solve this, we implemented **Grad-CAM**. This technique calculates the gradients of the target class and maps them back to the image, creating a heatmap that highlights the pathological regions. Our API handles image preprocessing, real-time inference, and heatmap generation in under 2 seconds."

---

### 3. Frontend & Design (Durga)
**[Transition: Navigating through the UI features]**

"I’m Durga, and I was responsible for the user interface and experience.

For a medical tool, clarity and ease of use are paramount. We built the frontend using **React.js** with a sleek, dark-themed **Tailwind CSS** design to reduce eye strain for clinicians.

We used **Framer Motion** for smooth transitions and **React-Dropzone** for a seamless file upload experience. The interface is fully responsive, meaning a doctor could potentially review a result on a tablet during rounds as easily as on a workstation. We also integrated a **Backend Health Check** system that ensures the model is loaded and ready before the user even starts uploading."

---

### 4. Live Demonstration (Roshini)
**[Transition: Sharing the screen with the live application]**

"Thank you, Durga. Now, let’s see NeuroScan AI in action. I am Roshini.

Starting from our **Hero Section**, we see a clear call to action. As I scroll down, we reach the **Upload Zone**. I will now upload a sample MRI scan.

**[Action: Upload an image]**

As you can see, the system provides real-time feedback with a loading animation as the backend processes the image.

**[Action: Scroll to Result Card]**

The analysis is complete!
- Here, we see the **Prediction**: In this case, 'Meningioma'.
- The **Confidence Bar** shows a 98% probability.
- Most importantly, if I click 'View Heatmap', we see the **Grad-CAM overlay**. Notice how the AI has highlighted the exact region of the tumor, matching what a radiologist would look for.

We also have a contact support system where users can send inquiries, which triggers an automated email notification sequence to our team and the user."

---

### 5. Closing & Future Scope (Nrusimha Sai)
**[Transition: Future Scope Slide]**

"To wrap up, NeuroScan AI is just the beginning.

In the future, we plan to support **3D DICOM** files for full-volume scans and integrate **Segmentational Masks** for exact tumor volume calculation. We are also looking into mobile integration to make this intelligence accessible everywhere.

We are now open for any questions. Thank you for your time."

---
