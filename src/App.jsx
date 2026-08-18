import ScrollVideo from './components/ScrollVideo'
import PillNav from './components/PillNav'
import ScrollFloat from './components/ScrollFloat'
import GlassPanel from './components/GlassPanel'

export default function App() {
  return (
    <>
      <ScrollVideo src="/hero.mp4" />
      <PillNav />
      <div style={{ position: 'relative', height: '500vh' }}>
        <ScrollFloat>{`Toute La\nPuissance`}</ScrollFloat>
        <GlassPanel />
      </div>
    </>
  )
}
