import ScrollVideo from './components/ScrollVideo'
import PillNav from './components/PillNav'
import ScrollFloat from './components/ScrollFloat'
import GlassPanel from './components/GlassPanel'
import Signature from './components/Signature'
import Metiers from './components/Metiers'
import Chantiers from './components/Chantiers'
import Zone from './components/Zone'

export default function App() {
  return (
    <>
      <ScrollVideo src="/hero.mp4" />
      <PillNav />
      <div id="hero" style={{ position: 'relative', height: '500vh' }}>
        <ScrollFloat>{`Toute La
Puissance`}</ScrollFloat>
        <GlassPanel />
      </div>
      <main className="relative z-30">
        {/* Le fond ne devient opaque qu'après un fondu : la vidéo du hero
            transparaît encore derrière le début de la section signature. */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div
            className="h-[50vh] w-full"
            style={{ background: 'linear-gradient(to bottom, transparent, var(--color-fond) 88%)' }}
          />
          <div className="w-full bg-fond" style={{ height: 'calc(100% - 50vh)' }} />
        </div>
        <Signature />
        <Metiers />
        <Chantiers />
        <Zone />
      </main>
    </>
  )
}
