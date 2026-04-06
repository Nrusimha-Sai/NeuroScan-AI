import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const CLASSES = ['Glioma', 'Meningioma', 'No-tumor', 'Pituitary']

const CLASS_COLORS = {
  Glioma:     { bar: 'from-red-500 to-red-400',    text: 'text-red-400',    glow: 'shadow-red-500/30'    },
  Meningioma: { bar: 'from-amber-500 to-amber-400', text: 'text-amber-400',  glow: 'shadow-amber-500/30'  },
  'No-tumor': { bar: 'from-green-500 to-green-400', text: 'text-green-400',  glow: 'shadow-green-500/30'  },
  Pituitary:  { bar: 'from-cyan-500 to-cyan-400',   text: 'text-cyan-400',   glow: 'shadow-cyan-500/30'   },
}

function ConfidenceBar({ label, value, isTop, index }) {
  const [ref, inView] = useInView({ triggerOnce: true })
  const pct    = Math.round(value * 100)
  const colors = CLASS_COLORS[label] || CLASS_COLORS['No-tumor']

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`p-4 rounded-2xl transition-all duration-300 ${
        isTop ? 'glass-strong border border-white/12' : 'glass border border-white/06'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isTop && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.5 }}
              className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-400 font-bold border border-cyan-400/30"
            >
              TOP
            </motion.span>
          )}
          <span className={`font-semibold text-sm ${isTop ? 'text-white' : 'text-slate-300'}`}>{label}</span>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.4 }}
          className={`font-bold text-lg font-display ${colors.text}`}
        >
          {pct}%
        </motion.span>
      </div>

      {/* Progress track */}
      <div className="h-2.5 rounded-full bg-white/08 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 1, ease: [0.25, 1, 0.5, 1] }}
          className={`h-full rounded-full bg-gradient-to-r ${colors.bar} shadow-lg ${colors.glow}`}
        />
      </div>
    </motion.div>
  )
}

export default function ConfidenceBars({ allProbabilities, prediction }) {
  // Sort: highest first
  const sorted = CLASSES
    .map((cls) => ({ label: cls, value: allProbabilities[cls] ?? 0 }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="space-y-3">
      <h4 className="font-display font-bold text-white text-lg mb-4">Class Probabilities</h4>
      {sorted.map((item, i) => (
        <ConfidenceBar
          key={item.label}
          label={item.label}
          value={item.value}
          isTop={item.label === prediction}
          index={i}
        />
      ))}
    </div>
  )
}
