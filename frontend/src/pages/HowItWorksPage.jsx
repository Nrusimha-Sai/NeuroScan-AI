import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Upload, Cpu, Flame, BarChart2, ChevronRight } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Upload,
    color: 'from-cyan-400 to-cyan-600',
    title: 'Upload Your MRI Scan',
    desc: 'Drag and drop or browse to upload a brain MRI image in JPEG, PNG, TIFF, or BMP format. Images up to 20 MB are supported.',
    extra: 'The image is sent securely to the backend via HTTPS multipart POST.',
  },
  {
    step: '02',
    icon: Cpu,
    color: 'from-purple-400 to-purple-600',
    title: 'Preprocessing & Inference',
    desc: 'The image is resized to 224×224, normalised using ImageNet statistics, and fed into our fine-tuned DenseNet121 model.',
    extra: 'A softmax layer converts raw logits into per-class probabilities.',
  },
  {
    step: '03',
    icon: Flame,
    color: 'from-orange-400 to-red-500',
    title: 'Grad-CAM Heatmap',
    desc: 'Gradient-weighted Class Activation Mapping hooks into denseblock4 and generates a colour-coded heatmap overlay.',
    extra: 'JET colour map: blue = low activation, red = high activation.',
  },
  {
    step: '04',
    icon: BarChart2,
    color: 'from-green-400 to-emerald-600',
    title: 'Results & Explanation',
    desc: 'Prediction label, confidence percentage, all-class probabilities, original image, and Grad-CAM overlay are returned to the UI.',
    extra: 'Download a plain-text diagnostic report for your records.',
  },
]

const classes = [
  { name: 'Glioma',     color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    desc: 'Tumour arising from glial cells. Most common and often aggressive.' },
  { name: 'Meningioma', color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  desc: 'Slow-growing tumour from the meninges. Usually benign.' },
  { name: 'No-tumor',   color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  desc: 'Normal brain tissue detected. No abnormal mass present.' },
  { name: 'Pituitary',  color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   desc: 'Abnormal growth in the pituitary gland. Mostly benign adenoma.' },
]

const item = {
  hidden:  { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25,1,0.5,1] } },
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 particle-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-display font-bold text-5xl text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A transparent look at the full AI inference pipeline — from raw MRI upload to clinical-grade heatmap.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mb-24">
          {/* Vertical connector */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-cyan-500/30 via-purple-500/30 to-transparent hidden md:block" />

          <div className="space-y-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={item}
                custom={i}
                className="flex gap-6"
              >
                {/* Step icon */}
                <div className={`relative flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg z-10`}>
                  <s.icon size={28} className="text-white" />
                  <span className="absolute -top-2 -right-2 text-xs font-bold text-white bg-brand-800 border border-white/15 rounded-full w-6 h-6 flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                {/* Content */}
                <div className="flex-1 glass rounded-2xl p-6 border border-white/06">
                  <h3 className="font-display font-bold text-xl text-white mb-2">{s.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">{s.desc}</p>
                  <p className="text-slate-500 text-xs">{s.extra}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Class explanations */}
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-display font-bold text-3xl text-white text-center mb-8">
          Tumour Classes
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {classes.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`${c.bg} border ${c.border} rounded-2xl p-5`}
            >
              <h3 className={`font-display font-bold text-lg ${c.color} mb-1`}>{c.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass rounded-3xl p-10 text-center border border-purple-500/20 bg-purple-500/05">
          <h3 className="font-display font-bold text-2xl text-white mb-3">Ready to try it?</h3>
          <p className="text-slate-400 mb-6">Upload your MRI scan and see the AI in action.</p>
          <Link to="/analyze">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139,92,246,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="btn-shine inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg cursor-pointer"
            >
              Start Analysis <ChevronRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
