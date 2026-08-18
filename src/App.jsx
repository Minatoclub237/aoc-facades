import { useEffect } from 'react'
import ScrollVideo from './components/ScrollVideo'
import PillNav from './components/PillNav'
import ScrollFloat from './components/ScrollFloat'
import GlassPanel from './components/GlassPanel'
import Metiers from './components/Metiers'
import Travaux from './components/Travaux'
import Chantiers from './components/Chantiers'
import Zone from './components/Zone'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { initSmoothScroll } from './smoothScroll'

export default function App() {
  useEffect(() => initSmoothScroll(), [])

  return (
    <>
      <ScrollVideo src="/hero.mp4" poster="/hero-poster.webp" />
      <PillNav />
      <div id="hero" style={{ position: 'relative', height: '500vh' }}>
        <ScrollFloat>{`Peau
Neuve`}</ScrollFloat>
        <GlassPanel />
      </div>
      <main className="relative z-30">
        {/* Le fond ne devient opaque qu'après un fondu : la vidéo du hero
            transparaît encore derrière le début des sections. */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div
            className="h-[50vh] w-full"
            style={{ background: 'linear-gradient(to bottom, transparent, var(--color-fond) 88%)' }}
          />
          <div className="w-full bg-fond" style={{ height: 'calc(100% - 50vh)' }} />
        </div>
        <Metiers />
        <Travaux />
        <Chantiers />
        <Zone />
        <Faq />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
