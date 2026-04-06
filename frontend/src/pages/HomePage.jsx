import HeroSection from '../components/HeroSection'
import ParticleBackground from '../components/ParticleBackground'

export default function HomePage() {
  return (
    <main className="relative">
      <ParticleBackground />
      <div className="relative z-10">
        <HeroSection />
      </div>
    </main>
  )
}
