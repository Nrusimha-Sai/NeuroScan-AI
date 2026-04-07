import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MessageSquare, MapPin, Send, CheckCircle2, AlertCircle, GitBranch, Globe, AtSign } from 'lucide-react'

const contactInfo = [
  { icon: Mail,        label: 'Email',    value: 'gmail',    href: 'mailto:saimahesh200505@gmail.com' },
  { icon: GitBranch,  label: 'GitHub',   value: 'github.com/neuroscan',  href: 'https://github.com/Nrusimha-Sai/NeuroScan-AI' },
  { icon: Globe,       label: 'Twitter',   value: '@neuroscan_ai',          href: 'https://twitter.com' },
  { icon: AtSign,      label: 'LinkedIn', value: 'linkedin.com', href: 'https://linkedin.com' },
]

const faqs = [
  { q: 'Is this tool free to use?',                   a: 'Yes, NeuroScan AI is completely free during our research phase. No sign-up required.' },
  { q: 'Are my MRI images stored?',                   a: 'No. Images are processed in memory and immediately discarded. We have zero data retention.' },
  { q: 'How accurate is the model?',                   a: 'Our DenseNet121 model achieves ~94% accuracy on the held-out test set across 4 classes.' },
  { q: 'Can I use this for clinical diagnosis?',       a: 'No. This is a research tool only. Always consult a licensed radiologist for medical decisions.' },
  { q: 'What image formats are supported?',           a: 'JPEG, PNG, BMP, TIFF, and WEBP up to 20 MB.' },
  { q: 'Why does the backend take time to start?',    a: 'We host on Render free-tier which sleeps after inactivity. The server wakes and loads the ML model (~27MB) on first request — typically 1–2 minutes.' },
]

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`glass rounded-2xl border transition-all duration-300 overflow-hidden ${open ? 'border-purple-500/30' : 'border-white/06'}`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
      >
        <span className={`font-semibold text-sm transition-colors ${open ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} className="text-purple-400 text-xl font-bold flex-shrink-0 ml-4">+</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ContactPage() {
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (window.location.search.includes('success=true')) {
      setStatus('success')
      // Clean up the URL query parameter
      window.history.replaceState(null, '', window.location.pathname)
      setTimeout(() => setStatus('idle'), 4000)
    }
  }, [])

  return (
    <div className="min-h-screen pt-28 pb-20 particle-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 items-center justify-center mb-4 glow-cyan">
            <MessageSquare size={30} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-5xl text-white mb-4">Get in <span className="gradient-text">Touch</span></h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Have questions, feedback, or collaboration ideas? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 mb-20">
          {/* Contact form — 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-3xl p-8 border border-white/08">
              <h2 className="font-display font-bold text-xl text-white mb-6">Send a Message</h2>
              <form action="https://api.web3forms.com/submit" method="POST" className="space-y-4" onSubmit={() => setStatus('sending')}>
                <input type="hidden" name="access_key" value="bbdd45f3-539d-4927-a2ed-8a8a5e88c459" />
                <input type="hidden" name="from_name" value="NeuroScan AI Contact Form" />
                {/* Dynamically construct redirect URL dynamically for netlify or localhost */}
                <input type="hidden" name="redirect" value={typeof window !== 'undefined' ? `${window.location.origin}/contact?success=true` : 'https://neuroscan-ai.netlify.app/contact?success=true'} />
                <input type="hidden" name="autoresponse" value="Hi there,&#10;&#10;Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.&#10;&#10;Best regards,&#10;The NeuroScan AI Team" />
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {['name', 'email'].map((field) => (
                    <div key={field}>
                      <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5 block">{field}</label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        required
                        placeholder={field === 'email' ? 'you@example.com' : 'Your name'}
                        className="w-full px-4 py-3 rounded-xl bg-white/05 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-xl bg-white/05 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us more..."
                    className="w-full px-4 py-3 rounded-xl bg-white/05 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all resize-none"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
                      <CheckCircle2 size={20} /> Message sent! We'll get back to you soon.
                    </motion.div>
                  ) : status === 'error' ? (
                    <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle size={16} /> Something went wrong. Please try again.
                    </motion.div>
                  ) : (
                    <motion.button
                      key="btn"
                      type="submit"
                      disabled={status === 'sending'}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-shine w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold cursor-pointer disabled:opacity-60"
                    >
                      {status === 'sending' ? (
                        <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Send size={18} /></motion.span> Sending…</>
                      ) : (
                        <><Send size={18} /> Send Message</>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>

          {/* Contact info — 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="glass rounded-3xl p-6 border border-white/08">
              <h2 className="font-display font-bold text-lg text-white mb-5">Contact Info</h2>
              <div className="space-y-4">
                {contactInfo.map((c) => (
                  <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/25 transition-colors">
                      <c.icon size={18} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">{c.label}</p>
                      <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{c.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="glass rounded-3xl p-6 border border-white/08">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Research Institution</p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Department of Computer Science &amp; AI<br />
                    Medical Informatics Research Lab
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <div>
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-3xl text-white text-center mb-8">
            Frequently Asked Questions
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
