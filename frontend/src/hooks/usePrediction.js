import { useState, useCallback } from 'react'
import { predictTumor } from '../utils/api'

export function usePrediction() {
  const [state, setState] = useState({
    loading: false,
    result: null,
    error: null,
    imagePreview: null,
  })

  const predict = useCallback(async (file) => {
    // Generate local preview URL
    const preview = URL.createObjectURL(file)
    setState({ loading: true, result: null, error: null, imagePreview: preview })

    try {
      const data = await predictTumor(file, true)
      setState((s) => ({ ...s, loading: false, result: data }))
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        'Network error — ensure the backend is running on port 8000.'
      setState((s) => ({ ...s, loading: false, error: message }))
    }
  }, [])

  const reset = useCallback(() => {
    setState({ loading: false, result: null, error: null, imagePreview: null })
  }, [])

  return { ...state, predict, reset }
}
