import { motion } from 'framer-motion'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using NeuroScan AI ("the Service"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Service.`,
  },
  {
    title: '2. Research-Only Use',
    content: `NeuroScan AI is provided strictly for research, educational, and demonstration purposes. The AI model outputs are NOT medical diagnoses and must NOT be used to make clinical decisions. You must consult a licensed medical professional for any health-related concerns.`,
  },
  {
    title: '3. Permitted Use',
    content: `You may use the Service to:
• Upload publicly available or personally owned brain MRI images for AI classification
• Review and download AI-generated reports for educational purposes
• Evaluate the model's explainability features (Grad-CAM)

You may NOT use the Service to:
• Submit images of individuals without their explicit consent
• Attempt to reverse-engineer or extract the model weights
• Use outputs in clinical or commercial medical applications`,
  },
  {
    title: '4. Intellectual Property',
    content: `The NeuroScan AI codebase, model architecture, and UI design are proprietary. You may not reproduce, distribute, or create derivative works without written permission.`,
  },
  {
    title: '5. Limitation of Liability',
    content: `The Service is provided "as is" without any warranties, express or implied. We shall not be liable for any damages arising from the use of, or inability to use, the Service — including any reliance on AI-generated results for medical decisions.`,
  },
  {
    title: '6. Modifications',
    content: `We reserve the right to modify or discontinue the Service at any time without notice. These terms may be updated periodically; continued use constitutes acceptance of the revised terms.`,
  },
  {
    title: '7. Governing Law',
    content: `These terms are governed by applicable law. Any disputes shall be resolved in the jurisdiction of the Service operator.`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-display font-bold text-4xl text-white mb-3">Terms of <span className="gradient-text">Use</span></h1>
          <p className="text-slate-500 text-sm">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl p-6 border border-white/06"
            >
              <h2 className="font-display font-bold text-white text-lg mb-3">{s.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{s.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
