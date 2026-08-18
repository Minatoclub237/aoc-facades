import ScrollVideo from './components/ScrollVideo'
import PillNav from './components/PillNav'
import ScrollFloat from './components/ScrollFloat'
import GlassPanel from './components/GlassPanel'
import Signature from './components/Signature'
import Metiers from './components/Metiers'
import Chantiers from './components/Chantiers'
import Zone from './components/Zone'
import Recrutement from './components/Recrutement'
import Contact from './components/Contact'

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
      {/* Fond noir opaque : les sections recouvrent la vidéo fixe du hero. */}
      <main className="relative z-30 bg-black">
        <Signature />
        <Metiers />
        <Chantiers />
        <Zone />
        <Recrutement />
        <Contact />
      </main>
    </>
  )
}
