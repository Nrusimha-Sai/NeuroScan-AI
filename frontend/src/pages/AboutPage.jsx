import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Brain, Target, Cpu, LineChart, Shield, Users } from 'lucide-react'

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const item = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25,1,0.5,1] } },
}

const team = [
  { name: 'K. Nrusimha Sai',   role: 'Model Architecture & Training',  avatar: '🧠' },
  { name: 'A. Durgasree',  role: 'FastAPI & Inference Pipeline',   avatar: '⚙️' },
  { name: 'Ch. Srinivas',   role: 'Clinical Validation & Ethics',   avatar: '⚕️' },
  { name: 'M. Roshini',      role: 'UI/UX & Visualisation',          avatar: '🎨' },
]

const values = [
  { icon: Target,    color: 'from-cyan-400 to-cyan-600',    title: 'Accuracy First',    desc: 'Every design decision prioritises diagnostic accuracy and clinical relevance.' },
  { icon: Shield,    color: 'from-purple-400 to-purple-600', title: 'Privacy by Design',  desc: 'Zero data retention — uploaded MRI images are never stored on our servers.' },
  { icon: LineChart, color: 'from-pink-400 to-pink-600',    title: 'Explainability',      desc: 'AI decisions are transparent through Grad-CAM visualisations for every result.' },
  { icon: Users,     color: 'from-amber-400 to-amber-600',  title: 'Open Research',       desc: 'Built for the research community. Our methodology and weights are openly documented.' },
]

function Section({ title, children, delay = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={container}
      className="mb-24"
    >
      <motion.h2 variants={item} className="font-display font-bold text-3xl text-white mb-8 text-center">
        {title}
      </motion.h2>
      {children}
    </motion.section>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 particle-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600 items-center justify-center mb-6 glow-purple"
          >
            <Brain size={40} className="text-white" strokeWidth={1.3} />
          </motion.div>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white mb-6">
            About <span className="gradient-text">NeuroScan AI</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            We are building the next generation of AI-assisted neuroradiology tools —
            making deep learning explainable, accessible, and clinically relevant.
          </p>
        </motion.div>

        {/* Mission */}
        <Section title="Our Mission">
          <motion.div
            variants={item}
            className="glass rounded-3xl p-8 border border-white/08 text-center max-w-3xl mx-auto"
          >
            <p className="text-lg text-slate-300 leading-relaxed">
              NeuroScan AI was created as a research platform to demonstrate how modern deep learning —
              specifically <span className="text-cyan-400 font-semibold">DenseNet121</span> paired with
              <span className="text-purple-400 font-semibold"> Grad-CAM explainability</span> — can
              assist radiologists in detecting and classifying brain tumours from MRI scans with
              unprecedented speed and transparency.
            </p>
          </motion.div>
        </Section>

        {/* Technology */}
        <Section title="Technology Stack">
          <motion.div variants={container} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Cpu,        color: 'from-cyan-400 to-cyan-600',    name: 'DenseNet121',   desc: 'ImageNet-pretrained CNN with 6.9M parameters, fine-tuned for 4-class tumour classification.' },
              { icon: Brain,      color: 'from-purple-400 to-purple-600', name: 'Grad-CAM',      desc: 'Gradient-weighted Class Activation Maps visualise the tumour region decision boundary.' },
              { icon: LineChart,  color: 'from-pink-400 to-pink-600',    name: 'FastAPI',       desc: 'High-performance Python backend with async endpoints, CORS, and OpenAPI documentation.' },
            ].map((t) => (
              <motion.div
                key={t.name}
                variants={item}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass rounded-2xl p-6 border border-white/06 card-hover"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-4`}>
                  <t.icon size={24} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{t.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* Values */}
        <Section title="Our Values">
          <motion.div variants={container} className="grid sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={item}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-6 border border-white/06 flex gap-4"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center flex-shrink-0`}>
                  <v.icon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white mb-1">{v.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* Team */}
        <Section title="The Team">
          <motion.div variants={container} className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {team.map((t) => (
              <motion.div
                key={t.name}
                variants={item}
                whileHover={{ y: -6, scale: 1.04 }}
                className="glass rounded-2xl p-6 text-center border border-white/06 card-hover"
              >
                <div className="text-4xl mb-3">{t.avatar}</div>
                <h3 className="font-display font-bold text-white text-sm mb-1">{t.name}</h3>
                <p className="text-slate-500 text-xs">{t.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 border border-amber-500/20 bg-amber-500/05 text-center"
        >
          <p className="text-amber-400/80 text-sm">
            ⚠️ NeuroScan AI is a research and educational platform. Results generated by this system
            should not replace professional medical diagnosis. Always consult a qualified radiologist.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
