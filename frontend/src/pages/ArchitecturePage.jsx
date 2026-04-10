import { motion } from 'framer-motion'
import { Cpu, Layers, GitBranch, ShieldCheck, Zap, Network } from 'lucide-react'
import ParticleBackground from '../components/ParticleBackground'

const features = [
  {
    icon: Network,
    title: 'Dense Connectivity',
    desc: 'Each layer connects to every other layer in a feed-forward fashion, ensuring maximum information flow and feature reuse.',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/05'
  },
  {
    icon: GitBranch,
    title: 'Vanishing Gradient Mitigation',
    desc: 'Deep networks often suffer from gradient loss. DenseNet mitigates this by providing direct supervision to all layers.',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/05'
  },
  {
    icon: Zap,
    title: 'Parameter Efficiency',
    desc: 'Unlike standard CNNs, DenseNet requires fewer parameters by avoiding redundant feature maps, making it computationally light.',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/05'
  }
]

const specs = [
  { label: 'Backbone', value: 'DenseNet-121' },
  { label: 'Input Resolution', value: '224 × 224 (RGB)' },
  { label: 'Optimizer', value: 'Adam (1e-4)' },
  { label: 'Loss Function', value: 'Cross-Entropy' },
  { label: 'Classes', value: '4 (Multi-class)' },
  { label: 'Framework', value: 'PyTorch' }
]

const blocks = [
  { name: 'Convolution', detail: '7x7 Conv, Stride 2' },
  { name: 'Pooling', detail: '3x3 Max Pool, Stride 2' },
  { name: 'Dense Block (1)', detail: '6 Layers' },
  { name: 'Transition (1)', detail: '1x1 Conv, 2x2 Avg Pool' },
  { name: 'Dense Block (2)', detail: '12 Layers' },
  { name: 'Transition (2)', detail: '1x1 Conv, 2x2 Avg Pool' },
  { name: 'Dense Block (3)', detail: '24 Layers' },
  { name: 'Transition (3)', detail: '1x1 Conv, 2x2 Avg Pool' },
  { name: 'Dense Block (4)', detail: '16 Layers' },
  { name: 'Global Pool', detail: '7x7 Global Average' },
  { name: 'Classifier', detail: 'Linear Layer (Softmax)' }
]

export default function ArchitecturePage() {
  return (
    <div className="relative min-h-screen pt-28 pb-20 particle-bg overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Cpu size={14} /> Model Architecture
          </div>
          <h1 className="font-display font-black text-5xl sm:text-6xl text-white mb-6">
            Inside the <span className="gradient-text">Neural Network</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A deep dive into the DenseNet-121 architecture that powers our tumour detection system, 
            optimized for high-precision medical imaging.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Visual Flow */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-2">
              <Layers size={22} className="text-cyan-500" /> Layer Stack
            </h2>
            <div className="space-y-2">
              {blocks.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-center gap-4 p-3 rounded-xl border border-white/05 bg-white/02 hover:bg-white/05 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none mb-1">{b.name}</h4>
                    <p className="text-[11px] text-slate-500 uppercase tracking-widest">{b.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Detailed Specs & Features */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Features Grid */}
            <div className="grid sm:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`${f.bg} border ${f.border} rounded-2xl p-6 relative group border-dashed`}
                >
                  <div className={`${f.color} mb-4`}>
                    <f.icon size={28} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Technical Specs Table */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 border border-white/05"
            >
              <h3 className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-2">
                <ShieldCheck size={22} className="text-purple-500" /> Hyperparameters
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4">
                {specs.map((s, i) => (
                  <div key={i}>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="text-xl font-display font-medium text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Model Philosophy */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10"
            >
              <h3 className="font-display font-bold text-lg text-white mb-3">Model Philosophy</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                NeuroScan AI leverages <strong>Transfer Learning</strong>. By utilizing a backbone pre-trained on 1.2 million images from 
                ImageNet, the model already understands basic textures, edges, and shapes. We then <strong>fine-tuned</strong> the 
                classifier head specifically on brain pathology datasets, allowing the network to specialize its vision on tumor-specific 
                signatures while maintaining the robust feature-extraction capabilities of one of the most efficient CNNs ever designed.
              </p>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  )
}
