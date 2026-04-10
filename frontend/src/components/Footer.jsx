import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, GitBranch, Globe, AtSign, Mail, Heart, ExternalLink } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL

const footerLinks = {
  Product: [
    { label: 'Analyze MRI',   to: '/analyze' },
    { label: 'How It Works',  to: '/how-it-works' },
    { label: 'Model Architecture', to: '/architecture' },
    { label: 'API Docs',      to: `${API_BASE}/docs`, external: true },
  ],
  Company: [
    { label: 'About Us',   to: '/about' },
    { label: 'Contact',    to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Use',   to: '/terms' },
  ],
  Technology: [
    { label: 'DenseNet121',       to: 'https://arxiv.org/abs/1608.06993', external: true },
    { label: 'Grad-CAM Paper',    to: 'https://arxiv.org/abs/1610.02391', external: true },
    { label: 'FastAPI Backend',   to: `${API_BASE}/docs`, external: true },
  ],
}

const socials = [
  { icon: GitBranch, href: 'https://github.com/', label: 'GitHub' },
  { icon: Globe,     href: 'https://twitter.com/', label: 'Twitter' },
  { icon: AtSign,    href: 'https://linkedin.com/', label: 'LinkedIn' },
  { icon: Mail,      href: '/contact', label: 'Email' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/08 overflow-hidden bg-[#05050f] z-10">
      {/* Background gradient for subtle texture on top of solid background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-800/80 pointer-events-none" />
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12"
        >
          {/* Brand column (spans 2) */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center glow-cyan">
                <Brain size={20} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">NeuroScan AI</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Advanced AI-powered brain MRI analysis platform. Detecting tumors with
              DenseNet121 deep learning and Grad-CAM explainability for transparent diagnostics.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors"
                >
                  <s.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <motion.div key={section} variants={itemVariants}>
              <h4 className="font-display font-bold text-white text-sm mb-5 tracking-wide uppercase">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-1.5 text-slate-400 text-sm hover:text-cyan-400 transition-colors duration-200"
                      >
                        {link.label}
                        <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-slate-400 text-sm hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block transition-transform"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-white/06 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            © {new Date().getFullYear()} NeuroScan AI.
          </p>
          <p className="text-slate-600 text-xs text-center sm:text-right max-w-sm">
            ⚠️ For research & educational purposes only. Not a substitute for professional medical advice.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
