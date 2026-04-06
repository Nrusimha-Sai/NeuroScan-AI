import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Flame, ToggleLeft, ToggleRight, ZoomIn } from 'lucide-react'

export default function HeatmapViewer({ originalImage, gradcamImage }) {
  const [showHeatmap, setShowHeatmap]   = useState(true)
  const [zoomed, setZoomed]             = useState(false)

  const currentImg = showHeatmap && gradcamImage ? gradcamImage : originalImage
  const currentSrc = `data:image/jpeg;base64,${currentImg}`

  return (
    <div className="space-y-4">
      {/* Header + toggle */}
      <div className="flex items-center justify-between">
        <h4 className="font-display font-bold text-white text-lg flex items-center gap-2">
          <Flame size={20} className="text-orange-400" />
          MRI Visualization
        </h4>
        {gradcamImage && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHeatmap((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/10 text-sm text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {showHeatmap ? <ToggleRight size={18} className="text-cyan-400" /> : <ToggleLeft size={18} />}
            {showHeatmap ? 'Grad-CAM' : 'Original'}
          </motion.button>
        )}
      </div>

      {/* Image container */}
      <div className="relative rounded-2xl overflow-hidden glass border border-white/08">
        {/* Labels */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={showHeatmap ? 'heatmap' : 'original'}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                showHeatmap && gradcamImage
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}
            >
              {showHeatmap && gradcamImage ? (
                <><Flame size={12} /> Grad-CAM Heatmap</>
              ) : (
                <><Eye size={12} /> Original MRI</>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Zoom button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setZoomed(true)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg glass border border-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ZoomIn size={16} />
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.img
            key={currentSrc}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
            src={currentSrc}
            alt={showHeatmap ? 'Grad-CAM heatmap overlay' : 'Original MRI'}
            className="w-full object-contain max-h-72 cursor-zoom-in"
            onClick={() => setZoomed(true)}
          />
        </AnimatePresence>

        {!gradcamImage && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-brand-900/80 to-transparent">
            <p className="text-slate-500 text-xs text-center">
              No Grad-CAM — not generated for No-tumor predictions
            </p>
          </div>
        )}
      </div>

      {/* Heatmap legend */}
      {gradcamImage && showHeatmap && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-2"
        >
          <span className="text-slate-500 text-xs">Low activation</span>
          <div className="flex-1 mx-3 h-2 rounded-full" style={{
            background: 'linear-gradient(90deg, #00008b, #0000ff, #00ffff, #ffff00, #ff8000, #ff0000)'
          }} />
          <span className="text-slate-500 text-xs">High activation</span>
        </motion.div>
      )}

      {/* ── Zoom lightbox ── */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 cursor-zoom-out p-4"
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={currentSrc}
              alt="Zoomed MRI"
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="absolute bottom-6 text-slate-400 text-sm">Click anywhere to close</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
