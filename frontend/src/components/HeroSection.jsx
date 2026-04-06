import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { Brain, Zap, Shield, ChevronRight, ArrowDown } from 'lucide-react'

const stats = [
  { value: '94.2%', label: 'Model Accuracy' },
  { value: '4',     label: 'Tumor Classes' },
  { value: '<3s',   label: 'Inference Time' },
  { value: 'XAI',   label: 'Explainable AI' },
]

const features = [
  {
    icon: Brain,
    color: 'from-cyan-400 to-cyan-600',
    glow: 'shadow-cyan-500/20',
    title: 'DenseNet121 Architecture',
    desc: 'State-of-the-art convolutional neural network pretrained on ImageNet and fine-tuned on brain MRI datasets for superior accuracy.',
  },
  {
    icon: Zap,
    color: 'from-purple-400 to-purple-600',
    glow: 'shadow-purple-500/20',
    title: 'Instant Classification',
    desc: 'Upload any JPEG or PNG brain MRI scan and receive a prediction with confidence scores in under 3 seconds.',
  },
  {
    icon: Shield,
    color: 'from-pink-400 to-pink-600',
    glow: 'shadow-pink-500/20',
    title: 'Grad-CAM Explainability',
    desc: 'See exactly where the model is looking — heat-mapped overlays highlight the tumor region for transparent AI diagnostics.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } },
}

// Animated 3D-style brain SVG illustration
function BrainIllustration() {
  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
      {/* Outer glow rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-cyan-400/20"
          animate={{ scale: [1, 1.05 + i * 0.04, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          style={{ margin: `${i * 20}px` }}
        />
      ))}

      {/* Core circle */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-8 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(0,245,255,0.15) 25%, transparent 50%, rgba(139,92,246,0.15) 75%, transparent 100%)',
        }}
      />

      {/* Center brain icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 glass-strong flex items-center justify-center glow-cyan">
            <Brain size={72} className="text-cyan-400" strokeWidth={1.2} />
          </div>
          {/* Scan line */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="scan-line" />
          </div>
        </motion.div>
      </div>

      {/* Orbiting dots */}
      {[0, 120, 240].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: '50%', left: '50%' }}
          animate={{ rotate: [deg, deg + 360] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="w-3 h-3 rounded-full bg-cyan-400"
            style={{ transform: 'translate(-50%, -130px)', boxShadow: '0 0 8px #00f5ff' }}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default function HeroSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden particle-bg grid-overlay">
      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/05 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm text-cyan-400 font-medium">AI-Powered Medical Diagnostics</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Detect Brain{' '}
              <span className="gradient-text text-glow-cyan">Tumors</span>
              <br />
              with AI Precision
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
              Upload a brain MRI scan and receive instant classification across 4 tumor types —
              powered by DenseNet121 with Grad-CAM heatmap explainability.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link to="/analyze">
                <motion.button
                  whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(0,245,255,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-shine flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg cursor-pointer"
                >
                  <Zap size={20} />
                  Start Analysis
                  <ChevronRight size={18} />
                </motion.button>
              </Link>
              <Link to="/how-it-works">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 text-white font-semibold text-lg hover:border-purple-400/40 transition-colors cursor-pointer"
                >
                  How It Works
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Brain illustration */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:flex justify-center"
          >
            <BrainIllustration />
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.03 }}
              className="glass rounded-2xl p-6 text-center border border-white/05 card-hover"
            >
              <div className="font-display text-4xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs">Scroll to explore</span>
        <ArrowDown size={18} />
      </motion.div>

      {/* Feature cards */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass rounded-2xl p-6 border border-white/05 cursor-default group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} shadow-lg ${f.glow} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon size={24} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
