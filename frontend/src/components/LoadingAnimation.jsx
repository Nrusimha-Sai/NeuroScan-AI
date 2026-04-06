import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

const pulseRings = [1, 2, 3, 4]

export default function LoadingAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16 gap-8"
    >
      {/* Animated rings */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {pulseRings.map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-cyan-400/30"
            animate={{
              scale:   [1, 1.5 + i * 0.3, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              delay:    i * 0.4,
              repeat:   Infinity,
              ease:     'easeOut',
            }}
            style={{ width: 40 + i * 20, height: 40 + i * 20 }}
          />
        ))}

        {/* Center brain */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-600/30 glass-strong flex items-center justify-center glow-cyan"
        >
          <Brain size={36} className="text-cyan-400" />
          {/* Scan line inside brain */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="scan-line" />
          </div>
        </motion.div>
      </div>

      {/* Text */}
      <div className="text-center">
        <motion.h3
          className="font-display font-bold text-2xl gradient-text mb-2"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Analyzing MRI Scan
        </motion.h3>
        <p className="text-slate-400 text-sm">Running DenseNet121 inference + Grad-CAM</p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-3">
        {['Preprocessing', 'Inference', 'Grad-CAM', 'Results'].map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 6px #00f5ff' }} />
              <span className="text-slate-500 text-xs">{step}</span>
            </motion.div>
            {i < 3 && <div className="w-8 h-px bg-white/10 mb-4" />}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
