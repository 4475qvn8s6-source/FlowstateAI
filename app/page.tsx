import { LanguageProvider } from '@/app/_components/LanguageContext'
import NavBar from '@/app/_components/NavBar'
import HeroSection from '@/app/_components/HeroSection'
import GsapSection from '@/app/_components/GsapSection'
import FramerSection from '@/app/_components/FramerSection'
import SplineSection from '@/app/_components/SplineSection'
import ThreeSection from '@/app/_components/ThreeSection'
import ContactSection from '@/app/_components/ContactSection'

export default function Home() {
  return (
    <LanguageProvider>
      <NavBar />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        <HeroSection />
        <GsapSection />
        <FramerSection />
        <SplineSection />
        <ThreeSection />
        <ContactSection />
      </main>
    </LanguageProvider>
  )
}
