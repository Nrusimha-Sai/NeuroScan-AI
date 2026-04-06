import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Brain } from 'lucide-react'
import LoadingAnimation from '../components/LoadingAnimation'
import ResultCard from '../components/ResultCard'
import { SkeletonResultLayout } from '../components/Skeleton'
import UploadZone from '../components/UploadZone'
import { usePrediction } from '../hooks/usePrediction'

export default function AnalyzePage() {
  const { loading, result, error, predict, reset } = usePrediction()

  return (
    <div className="relative min-h-screen pt-24 pb-20 particle-bg grid-overlay">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, delay: 0.1 }}
            className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 items-center justify-center mb-4 glow-cyan"
          >
            <Brain size={32} className="text-white" />
          </motion.div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Brain MRI <span className="gradient-text">Analysis</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Upload your MRI scan below. Our AI will classify it into one of four categories
            and highlight the region of interest using Grad-CAM.
          </p>
        </motion.div>

        {/* Main content area */}
        <AnimatePresence mode="wait">
          {/* Loading — top animation + skeleton layout below */}
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
              <LoadingAnimation />
              <SkeletonResultLayout />
            </motion.div>
          )}

          {/* Result */}
          {!loading && result && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultCard result={result} onReset={reset} />
            </motion.div>
          )}

          {/* Upload (initial + after reset) */}
          {!loading && !result && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <UploadZone onFileSelect={predict} disabled={loading} />

              {/* Error state */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                  >
                    <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 font-semibold text-sm">Analysis Failed</p>
                      <p className="text-red-400/70 text-sm mt-1">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info cards */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid sm:grid-cols-3 gap-4 mt-10"
              >
                {[
                  { emoji: '🧠', title: '4 Classes', desc: 'Glioma, Meningioma, No-tumor, Pituitary' },
                  { emoji: '🔥', title: 'Grad-CAM', desc: 'Visual heatmap highlighting the tumor region' },
                  { emoji: '🔒', title: 'Private', desc: 'Your image is never stored on our servers' },
                ].map((card) => (
                  <motion.div
                    key={card.title}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="glass rounded-2xl p-5 border border-white/06 text-center card-hover"
                  >
                    <div className="text-3xl mb-2">{card.emoji}</div>
                    <h3 className="font-display font-bold text-white text-sm mb-1">{card.title}</h3>
                    <p className="text-slate-500 text-xs">{card.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
