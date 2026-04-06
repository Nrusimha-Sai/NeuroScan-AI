import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, AlertCircle, CircleX, Download, RefreshCw } from 'lucide-react'
import CountUpRaw from 'react-countup'
const CountUp = typeof CountUpRaw === 'object' && CountUpRaw.default ? CountUpRaw.default : CountUpRaw
import ConfidenceBars from './ConfidenceBars'
import HeatmapViewer from './HeatmapViewer'
import { jsPDF } from 'jspdf'

const SEVERITY_CONFIG = {
  none: {
    icon: CheckCircle2,
    label: 'No Tumor Detected',
    badgeClass: 'severity-none',
    gradientFrom: 'from-green-500/10',
    borderColor: 'border-green-500/20',
    iconColor: 'text-green-400',
    ringColor: 'rgba(74,222,128,0.2)',
  },
  low: {
    icon: AlertTriangle,
    label: 'Low Severity',
    badgeClass: 'severity-low',
    gradientFrom: 'from-amber-500/10',
    borderColor: 'border-amber-500/20',
    iconColor: 'text-amber-400',
    ringColor: 'rgba(251,191,36,0.2)',
  },
  medium: {
    icon: AlertCircle,
    label: 'Moderate Severity',
    badgeClass: 'severity-medium',
    gradientFrom: 'from-orange-500/10',
    borderColor: 'border-orange-500/20',
    iconColor: 'text-orange-400',
    ringColor: 'rgba(251,146,60,0.2)',
  },
  high: {
    icon: CircleX,
    label: 'High Severity',
    badgeClass: 'severity-high',
    gradientFrom: 'from-red-500/10',
    borderColor: 'border-red-500/20',
    iconColor: 'text-red-400',
    ringColor: 'rgba(248,113,113,0.2)',
  },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
}

async function downloadReport(result) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let y = 20

  // ── Branding / Header ──
  doc.setFillColor(15, 23, 42) // Slate-900
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(0, 245, 255) // Cyan-400
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('NEUROSCAN AI', margin, 25)
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('ADVANCED BRAIN MRI ANALYSIS REPORT', margin, 32)
  
  doc.setFontSize(8)
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin - 40, 25)

  y = 55
  
  // ── Main Result ──
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('ANALYSIS SUMMARY', margin, y)
  y += 10
  
  doc.setDrawColor(226, 232, 240) // Slate-200
  doc.line(margin, y, pageWidth - margin, y)
  y += 15

  // Primary Data
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Clinical Prediction:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(result.prediction, margin + 50, y)
  y += 8
  
  doc.setFont('helvetica', 'bold')
  doc.text('Confidence Level:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(`${(result.confidence * 100).toFixed(2)}%`, margin + 50, y)
  y += 8
  
  doc.setFont('helvetica', 'bold')
  doc.text('Severity Status:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(result.severity.toUpperCase(), margin + 50, y)
  y += 15

  // Description
  doc.setFont('helvetica', 'bold')
  doc.text('Clinical Findings:', margin, y)
  y += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const splitDesc = doc.splitTextToSize(result.description, pageWidth - 2 * margin)
  doc.text(splitDesc, margin, y)
  y += splitDesc.length * 5 + 10

  // ── Probability Breakdown ──
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('PROBABILITY BREAKDOWN', margin, y)
  y += 8
  doc.setDrawColor(226, 232, 240)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  doc.setFontSize(10)
  Object.entries(result.all_probabilities).forEach(([cls, prob]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(cls, margin, y)
    
    // Simple progress bar
    const barWidth = 80
    const fillWidth = barWidth * prob
    doc.setDrawColor(203, 213, 225)
    doc.rect(margin + 40, y - 4, barWidth, 5)
    doc.setFillColor(139, 92, 246) // Purple-500
    doc.rect(margin + 40, y - 4, fillWidth, 5, 'F')
    
    doc.setFont('helvetica', 'normal')
    doc.text(`${(prob * 100).toFixed(1)}%`, margin + 125, y)
    y += 8
  })

  // ── Images Section ──
  if (y > 200) { doc.addPage(); y = 20 }
  else { y += 10 }

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('VISUAL ANALYSIS', margin, y)
  y += 8
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  const imgSize = 70
  try {
    if (result.original_image) {
      doc.addImage(result.original_image, 'JPEG', margin, y, imgSize, imgSize)
      doc.setFontSize(8)
      doc.text('ORIGINAL SCAN', margin + imgSize/2, y + imgSize + 5, { align: 'center' })
    }
    if (result.gradcam_image) {
      doc.addImage(result.gradcam_image, 'JPEG', margin + imgSize + 10, y, imgSize, imgSize)
      doc.setFontSize(8)
      doc.text('AI ATTENTION HEATMAP', margin + imgSize + 10 + imgSize/2, y + imgSize + 5, { align: 'center' })
    }
  } catch (e) {
    console.error('Error adding images to PDF:', e)
    doc.text('[Error rendering scan images]', margin, y + 10)
  }

  // ── Footer ──
  const footerY = doc.internal.pageSize.getHeight() - 25
  doc.setDrawColor(226, 232, 240)
  doc.line(margin, footerY, pageWidth - margin, footerY)
  
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  const disclaimer = [
    'DISCLAIMER: This report is generated by NeuroScan AI for educational and research purposes only.',
    'It does NOT constitute a medical diagnosis. Results should be reviewed by a certified radiologist.',
    'NeuroScan AI is not liable for clinical decisions made based on this automated analysis.'
  ]
  doc.text(disclaimer, margin, footerY + 5)

  doc.save(`NeuroScan_Report_${Date.now()}.pdf`)
}

export default function ResultCard({ result, onReset }) {
  const cfg  = SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.none
  const Icon = cfg.icon
  const pct  = Math.round(result.confidence * 100)

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto"
    >
      {/* ── Top result summary ── */}
      <motion.div
        className={`glass rounded-3xl p-8 border ${cfg.borderColor} bg-gradient-to-br ${cfg.gradientFrom} to-transparent mb-6`}
        whileHover={{ boxShadow: `0 0 40px ${cfg.ringColor}` }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 border ${cfg.borderColor} bg-white/05`}
            style={{ boxShadow: `0 0 30px ${cfg.ringColor}` }}
          >
            <Icon size={40} className={cfg.iconColor} />
          </motion.div>

          {/* Prediction text */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-bold mb-2 ${cfg.badgeClass}`}
            >
              {cfg.label}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="font-display font-bold text-4xl text-white mb-1"
            >
              {result.prediction}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-400 text-sm leading-relaxed max-w-lg"
            >
              {result.description}
            </motion.p>
          </div>

          {/* Confidence donut-style */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.4 }}
            className="flex flex-col items-center gap-1 flex-shrink-0"
          >
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <motion.circle
                  cx="48" cy="48" r="40"
                  fill="none"
                  stroke="url(#confGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - result.confidence) }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="confGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f5ff" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-bold text-xl gradient-text">
                  <CountUp end={pct} duration={1.5} suffix="%" delay={0.5} />
                </span>
              </div>
            </div>
            <span className="text-slate-500 text-xs">Confidence</span>
          </motion.div>
        </div>

        {/* Medical disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-3 rounded-xl bg-amber-500/05 border border-amber-500/15 text-amber-400/80 text-xs"
        >
          ⚠️ This result is generated by an AI model for research purposes only and should NOT replace professional medical diagnosis. Always consult a qualified radiologist.
        </motion.div>
      </motion.div>

      {/* ── Detail grid ── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Confidence bars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="glass rounded-3xl p-6 border border-white/08"
        >
          <ConfidenceBars allProbabilities={result.all_probabilities} prediction={result.prediction} />
        </motion.div>

        {/* Heatmap viewer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="glass rounded-3xl p-6 border border-white/08"
        >
          <HeatmapViewer
            originalImage={result.original_image}
            gradcamImage={result.gradcam_image}
          />
        </motion.div>
      </div>

      {/* ── Action buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap gap-4 justify-center mt-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => downloadReport(result)}
          className="btn-shine flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/15 text-white font-semibold hover:border-cyan-400/40 transition-colors cursor-pointer"
        >
          <Download size={18} className="text-cyan-400" />
          Download Report
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(139,92,246,0.3)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          className="btn-shine flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold cursor-pointer"
        >
          <RefreshCw size={18} />
          Analyze Another Scan
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
