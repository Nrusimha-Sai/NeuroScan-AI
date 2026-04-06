import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s — model inference can be slow on CPU
})

/**
 * POST /predict
 * @param {File} imageFile  - The MRI image file
 * @param {boolean} gradcam - Whether to generate Grad-CAM (default true)
 * @returns {Promise<PredictionResponse>}
 */
export async function predictTumor(imageFile, gradcam = true) {
  const formData = new FormData()
  formData.append('file', imageFile)
  formData.append('gradcam', gradcam)

  const response = await apiClient.post(`/predict?gradcam=${gradcam}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/**
 * GET /health
 */
export async function getHealth() {
  const response = await apiClient.get('/health')
  return response.data
}

export default apiClient
