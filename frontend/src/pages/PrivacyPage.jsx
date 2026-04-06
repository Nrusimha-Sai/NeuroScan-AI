import { motion } from 'framer-motion'

const sections = [
  {
    title: '1. Information We Collect',
    content: `We do not collect, store, or transmit any personal health information. MRI images uploaded to NeuroScan AI are processed entirely in memory on our backend server and are immediately discarded after inference is complete. No image data is written to disk or retained in any database.

We may collect anonymous, aggregate usage statistics (page views, request counts) to improve our service. No personally identifiable information is associated with these metrics.`,
  },
  {
    title: '2. How We Use Your Data',
    content: `Your uploaded MRI images are used solely for the purpose of running AI inference (tumour classification and Grad-CAM heatmap generation). Results are returned to your browser session and are not stored server-side.

We do not use your data for model retraining, advertising, or sharing with third parties.`,
  },
  {
    title: '3. Cookies & Tracking',
    content: `NeuroScan AI does not use tracking cookies, advertising pixels, or third-party analytics beyond basic anonymised request logging.`,
  },
  {
    title: '4. Medical Disclaimer',
    content: `NeuroScan AI is a research and educational platform. The AI-generated results are NOT medical diagnoses. They must not be used as a substitute for professional medical evaluation by a licensed radiologist or physician. Always seek qualified medical advice for health concerns.`,
  },
  {
    title: '5. Data Security',
    content: `All API communications are encrypted via HTTPS/TLS. Our backend is hosted on secure cloud infrastructure. Because we do not persist any user data, there is no database that could be breached.`,
  },
  {
    title: '6. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. Significant changes will be noted on this page with a revised effective date.`,
  },
  {
    title: '7. Contact',
    content: `For privacy-related questions, please contact us at hello@neuroscan.ai.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-display font-bold text-4xl text-white mb-3">Privacy <span className="gradient-text">Policy</span></h1>
          <p className="text-slate-500 text-sm">Effective date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
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
