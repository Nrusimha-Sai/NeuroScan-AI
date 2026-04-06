import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Wifi, WifiOff, Clock, RefreshCw, CheckCircle2 } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const POLL_INTERVAL  = 4000   // ms between polls
const FAST_INTERVAL  = 2000   // ms when getting close
const TIMEOUT_MS     = 180000 // 3 min max wait

/* Render cold-start fun facts shown while waiting */
const FUN_FACTS = [
  'DenseNet121 has 6.9 million parameters — all loaded in memory for you.',
  'Grad-CAM uses gradient flow to pinpoint exactly where the model looks.',
  'Our model was trained on over 3,000 labelled brain MRI scans.',
  'Meningioma is the most common primary brain tumour in adults.',
  'Cold-starting a Python ML server takes longer — we\'re warming up the GPU/CPU...',
  'The model achieves ~94% accuracy across 4 tumour classes.',
  'Grad-CAM was introduced by Selvaraju et al. at ICCV 2017.',
  'DenseNet connects every layer to every other layer — maximising feature reuse.',
]

/* Animated brain scan line used in the loader */
function BrainLoader({ status }) {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center mx-auto">
      {/* Spinning rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-cyan-400/20"
          style={{ width: 40 + i * 30, height: 40 + i * 30 }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.04, 1] }}
          transition={{ duration: 6 - i, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {/* Pulse rings */}
      {[1, 2].map((i) => (
        <motion.div
          key={`p${i}`}
          className="absolute rounded-full border border-purple-500/15"
          style={{ width: 80 + i * 28, height: 80 + i * 28 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, delay: i * 0.6, repeat: Infinity }}
        />
      ))}
      {/* Center */}
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/25 to-purple-600/25 glass-strong glow-cyan flex items-center justify-center"
      >
        <Brain size={48} className="text-cyan-400" strokeWidth={1.3} />
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="scan-line" />
        </div>
      </motion.div>
      {/* Status dot */}
      <div className={`absolute bottom-3 right-3 w-4 h-4 rounded-full border-2 border-brand-900 ${
        status === 'online' ? 'bg-green-400' : status === 'error' ? 'bg-red-400' : 'bg-amber-400'
      }`}>
        {status !== 'online' && status !== 'error' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-400"
            animate={{ scale: [1, 1.8], opacity: [1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  )
}

export default function BackendStartupLoader({ onReady }) {
  const [status, setStatus]           = useState('waiting')   // waiting | connecting | online | error
  const [elapsed, setElapsed]         = useState(0)
  const [attempts, setAttempts]       = useState(0)
  const [factIdx, setFactIdx]         = useState(0)
  const [dots, setDots]               = useState('')
  const startRef                      = useRef(Date.now())
  const timedOut                       = elapsed >= TIMEOUT_MS

  /* Elapsed timer */
  useEffect(() => {
    const t = setInterval(() => setElapsed(Date.now() - startRef.current), 1000)
    return () => clearInterval(t)
  }, [])

  /* Cycling dots */
  useEffect(() => {
    const t = setInterval(() => setDots((d) => d.length >= 3 ? '' : d + '.'), 500)
    return () => clearInterval(t)
  }, [])

  /* Fact rotator */
  useEffect(() => {
    const t = setInterval(() => setFactIdx((i) => (i + 1) % FUN_FACTS.length), 6000)
    return () => clearInterval(t)
  }, [])

  /* Health polling */
  useEffect(() => {
    if (timedOut) return
    let cancelled = false

    const poll = async () => {
      if (cancelled) return
      setStatus('connecting')
      setAttempts((a) => a + 1)
      try {
        const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(5000) })
        if (!cancelled && res.ok) {
          const data = await res.json()
          if (data.model_loaded) {
            setStatus('online')
            setTimeout(() => onReady(), 1200) // brief "ready" pause
            return
          }
        }
      } catch {
        // still starting
      }
      if (!cancelled) {
        const wait = attempts > 10 ? FAST_INTERVAL : POLL_INTERVAL
        setTimeout(poll, wait)
      }
    }

    poll()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timedOut])

  const elapsedSec = Math.floor(elapsed / 1000)
  const elapsedMin = Math.floor(elapsedSec / 60)
  const elapsedS   = elapsedSec % 60

  const statusMessages = {
    waiting:    'Initialising connection',
    connecting: 'Pinging server',
    online:     'Backend ready!',
    error:      'Connection failed',
  }

  return (
    <div className="fixed inset-0 z-[999] bg-brand-900 flex flex-col items-center justify-center particle-bg grid-overlay overflow-hidden">
      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

      <div className="w-full max-w-lg px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center glow-cyan">
            <Brain size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl gradient-text">NeuroScan AI</span>
        </motion.div>

        {/* Brain animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <BrainLoader status={status} />
        </motion.div>

        {/* Status area */}
        <AnimatePresence mode="wait">
          {status === 'online' ? (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <CheckCircle2 size={48} className="text-green-400 mx-auto mb-3" />
              <h2 className="font-display font-bold text-2xl text-green-400">Backend Ready!</h2>
              <p className="text-slate-400 text-sm mt-1">Launching NeuroScan AI{dots}</p>
            </motion.div>
          ) : (
            <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
              <h2 className="font-display font-bold text-2xl text-white mb-2">
                Starting AI Backend{dots}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our server is warming up on Render — this takes{' '}
                <span className="text-amber-400 font-semibold">1–2 minutes</span> on first load.
                <br />
                Hang tight while the ML model loads into memory.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        {status !== 'online' && (
          <div className="mb-8">
            <div className="h-1.5 rounded-full bg-white/08 overflow-hidden mb-2">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500"
                style={{ backgroundSize: '200% 100%' }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                  width: timedOut ? '100%' : `${Math.min(95, (elapsedSec / 120) * 100)}%`,
                }}
                transition={{
                  backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' },
                  width: { duration: 0.5 },
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                {status === 'connecting' ? <Wifi size={12} className="text-cyan-400" /> : <WifiOff size={12} />}
                {statusMessages[status]} · attempt #{attempts}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {elapsedMin > 0 ? `${elapsedMin}m ` : ''}{elapsedS}s elapsed
              </span>
            </div>
          </div>
        )}

        {/* Timeout message */}
        {timedOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20"
          >
            <p className="text-red-400 text-sm font-semibold mb-1">Connection timed out</p>
            <p className="text-red-400/70 text-xs mb-3">
              The backend did not respond within 3 minutes. It may be down or still deploying.
            </p>
            <button
              onClick={() => { startRef.current = Date.now(); setElapsed(0); setAttempts(0); setStatus('waiting'); }}
              className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} /> Retry Connection
            </button>
          </motion.div>
        )}

        {/* Fun fact card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={factIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-5 border border-white/08"
          >
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold">
              Did you know?
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">{FUN_FACTS[factIdx]}</p>
            <div className="flex justify-center gap-1.5 mt-4">
              {FUN_FACTS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === factIdx ? 'w-5 bg-cyan-400' : 'w-1.5 bg-white/15'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
    </div>
  )
}
