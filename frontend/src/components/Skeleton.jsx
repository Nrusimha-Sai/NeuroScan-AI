/* Skeleton shimmer components for progressive loading */
import { motion } from 'framer-motion'

function Shimmer({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white/05 ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['-200% 0%', '200% 0%'] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="glass rounded-3xl p-6 border border-white/06 space-y-4">
      <div className="flex items-center gap-3">
        <Shimmer className="w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-3 w-1/2" />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <Shimmer key={i} className={`h-3 ${i === rows - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

export function SkeletonBar() {
  return (
    <div className="space-y-3">
      {[80, 60, 40, 30].map((w, i) => (
        <div key={i} className="flex items-center gap-3">
          <Shimmer className="h-4 w-24 flex-shrink-0" />
          <div className="flex-1 h-2.5 rounded-full bg-white/06 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ width: `${w}%`, background: 'linear-gradient(90deg, rgba(0,245,255,0.3), rgba(139,92,246,0.3))' }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          </div>
          <Shimmer className="h-4 w-10 flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonImage() {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <Shimmer className="w-full h-64" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-slate-600 text-xs"
        >
          Loading image…
        </motion.div>
      </div>
    </div>
  )
}

export function SkeletonResultLayout() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Summary card */}
      <div className="glass rounded-3xl p-8 border border-white/08">
        <div className="flex flex-col md:flex-row gap-6">
          <Shimmer className="w-20 h-20 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Shimmer className="h-4 w-28" />
            <Shimmer className="h-9 w-48" />
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-5/6" />
          </div>
          <Shimmer className="w-24 h-24 rounded-full flex-shrink-0" />
        </div>
      </div>
      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-6 border border-white/08">
          <Shimmer className="h-5 w-40 mb-6" />
          <SkeletonBar />
        </div>
        <div className="glass rounded-3xl p-6 border border-white/08">
          <Shimmer className="h-5 w-40 mb-4" />
          <SkeletonImage />
        </div>
      </div>
    </div>
  )
}
