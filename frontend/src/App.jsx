import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

import BackendStartupLoader from './components/BackendStartupLoader'
import ScrollToTop         from './components/ScrollToTop'
import Navbar              from './components/Navbar'
import Footer              from './components/Footer'

import HomePage       from './pages/HomePage'
import AnalyzePage    from './pages/AnalyzePage'
import HowItWorksPage from './pages/HowItWorksPage'
import AboutPage      from './pages/AboutPage'
import ContactPage    from './pages/ContactPage'
import PrivacyPage    from './pages/PrivacyPage'
import TermsPage      from './pages/TermsPage'

/* Page transition wrapper */
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

/* Animated routes — must be inside BrowserRouter */
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"            element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/analyze"     element={<PageTransition><AnalyzePage /></PageTransition>} />
        <Route path="/how-it-works" element={<PageTransition><HowItWorksPage /></PageTransition>} />
        <Route path="/about"       element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/contact"     element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/privacy"     element={<PageTransition><PrivacyPage /></PageTransition>} />
        <Route path="/terms"       element={<PageTransition><TermsPage /></PageTransition>} />
        {/* 404 */}
        <Route path="*" element={
          <PageTransition>
            <div className="min-h-screen flex flex-col items-center justify-center particle-bg text-center px-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="font-display font-black text-8xl gradient-text mb-4"
              >
                404
              </motion.div>
              <p className="text-slate-400 text-xl mb-6">Page not found</p>
              <a href="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold">
                Go Home
              </a>
            </div>
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const [backendReady, setBackendReady] = useState(false)

  return (
    <>
      {/* ── Backend startup gate ── */}
      <AnimatePresence>
        {!backendReady && (
          <motion.div key="loader" exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.5 }}>
            <BackendStartupLoader onReady={() => setBackendReady(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main app (rendered once backend is ready) ── */}
      {backendReady && (
        <BrowserRouter>
          <ScrollToTop />
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#12122e',
                color: '#e2e8f0',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />

          {/* Layout */}
          <div className="noise min-h-screen flex flex-col bg-brand-900">
            <Navbar />
            <main className="flex-1">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      )}
    </>
  )
}
