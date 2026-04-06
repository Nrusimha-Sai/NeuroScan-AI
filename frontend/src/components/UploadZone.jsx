import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ImageIcon, X, Zap, AlertCircle } from 'lucide-react'

const ACCEPTED_TYPES = { 'image/*': ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'] }
const MAX_SIZE       = 20 * 1024 * 1024  // 20 MB

export default function UploadZone({ onFileSelect, disabled }) {
  const [preview, setPreview] = useState(null)
  const [file,    setFile]    = useState(null)
  const [error,   setError]   = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    setError(null)
    if (rejected.length) {
      const r = rejected[0]
      if (r.errors?.[0]?.code === 'file-too-large') setError('File exceeds 20 MB limit.')
      else if (r.errors?.[0]?.code === 'file-invalid-type') setError('Please upload a JPEG, PNG, BMP, TIFF, or WEBP image.')
      else setError('Invalid file.')
      return
    }
    if (!accepted.length) return
    const f = accepted[0]
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   ACCEPTED_TYPES,
    maxSize:  MAX_SIZE,
    multiple: false,
    disabled,
  })

  const clear = (e) => {
    e.stopPropagation()
    setFile(null)
    setPreview(null)
    setError(null)
  }

  const analyze = (e) => {
    e.stopPropagation()
    if (file) onFileSelect(file)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!preview ? (
          /* ── Drop Zone ── */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            {...getRootProps()}
            className={`upload-zone relative rounded-3xl border-2 border-dashed p-12 text-center cursor-pointer select-none transition-all duration-300 ${
              isDragActive
                ? 'border-cyan-400 bg-cyan-400/05 shadow-[0_0_40px_rgba(0,245,255,0.2)]'
                : 'border-white/15 glass hover:border-purple-400/50 hover:bg-white/02'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />

            {/* Animated icon */}
            <motion.div
              animate={isDragActive ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                isDragActive
                  ? 'bg-cyan-400/20 glow-cyan'
                  : 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20'
              }`}
            >
              <Upload size={40} className={isDragActive ? 'text-cyan-400' : 'text-purple-400'} />
            </motion.div>

            <h3 className="font-display font-bold text-2xl text-white mb-2">
              {isDragActive ? 'Release to upload' : 'Drop your MRI scan here'}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              or <span className="text-cyan-400 font-medium underline underline-offset-2">browse files</span>
            </p>
            <p className="text-slate-500 text-xs">Supports JPEG · PNG · BMP · TIFF · WEBP — max 20 MB</p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-red-400 text-sm"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {/* Corner decorations */}
            {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos) => (
              <div key={pos} className={`absolute ${pos} w-4 h-4 border-cyan-400/40 ${
                pos.includes('top-3 left-3')    ? 'border-t-2 border-l-2' :
                pos.includes('top-3 right-3')   ? 'border-t-2 border-r-2' :
                pos.includes('bottom-3 left-3') ? 'border-b-2 border-l-2' :
                                                   'border-b-2 border-r-2'
              } rounded-sm`} />
            ))}
          </motion.div>

        ) : (
          /* ── Preview ── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative glass rounded-3xl p-4 border border-white/10"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img src={preview} alt="MRI preview" className="w-full object-contain max-h-80 rounded-2xl" />
              {/* Scan overlay animation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                <div className="scan-line" />
              </div>
              {/* Remove button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clear}
                disabled={disabled}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors cursor-pointer"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* File info */}
            <div className="flex items-center gap-3 mt-4 px-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <ImageIcon size={20} className="text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{file?.name}</p>
                <p className="text-slate-500 text-xs">{(file?.size / 1024).toFixed(1)} KB</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0,245,255,0.3)' }}
                whileTap={{ scale: 0.97 }}
                onClick={analyze}
                disabled={disabled}
                className="btn-shine px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={16} />
                Analyze
              </motion.button>
            </div>

            {/* Change file link */}
            {!disabled && (
              <button
                onClick={clear}
                className="mt-3 w-full text-center text-slate-500 text-xs hover:text-slate-300 transition-colors py-2 cursor-pointer"
              >
                ← Choose a different file
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
