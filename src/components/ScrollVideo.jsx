import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Safari iOS ne sait pas déplacer la tête de lecture d'une balise <video> image
// par image : l'élément reste noir. Sur tactile, le défilement pilote donc une
// séquence d'images dessinée dans un canvas — plus lourd, mais fiable partout.
const tactile =
  typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches

const IMAGES = 50
const imageUrl = (i) => '/hero-frames/f' + String(i + 1).padStart(3, '0') + '.webp'

export default function ScrollVideo({ src, poster, className = '' }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)

  // --- Tactile : séquence d'images pilotée au scroll
  useEffect(() => {
    if (!tactile) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const images = []
    let courante = -1
    let vivant = true

    const dimensionner = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      dessiner(courante < 0 ? 0 : courante, true)
    }

    // Recadrage « cover » : l'image remplit l'écran sans se déformer.
    const dessiner = (i, force = false) => {
      const image = images[i]
      if (!image || !image.complete || (!force && i === courante)) return
      courante = i
      const echelle = Math.max(canvas.width / image.width, canvas.height / image.height)
      const l = image.width * echelle
      const h = image.height * echelle
      ctx.drawImage(image, (canvas.width - l) / 2, (canvas.height - h) / 2, l, h)
    }

    // La première image d'abord, pour avoir quelque chose à l'écran tout de
    // suite ; les suivantes se chargent ensuite, dans l'ordre du scroll.
    const charger = (i) =>
      new Promise((resolve) => {
        const image = new Image()
        image.decoding = 'async'
        image.onload = () => {
          images[i] = image
          if (i === 0) dessiner(0, true)
          resolve()
        }
        image.onerror = resolve
        image.src = imageUrl(i)
      })

    ;(async () => {
      await charger(0)
      for (let i = 1; i < IMAGES && vivant; i++) await charger(i)
    })()

    dimensionner()
    window.addEventListener('resize', dimensionner)

    const trigger = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => dessiner(Math.round(self.progress * (IMAGES - 1))),
    })

    return () => {
      vivant = false
      trigger.kill()
      window.removeEventListener('resize', dimensionner)
    }
  }, [])

  // --- Souris : la vidéo est scrubbée directement, en pleine définition
  useEffect(() => {
    const video = videoRef.current
    if (!video || tactile) return

    // Amorcer la lecture force le décodage de la première image.
    const demarrer = () => {
      const lecture = video.play()
      if (lecture && typeof lecture.then === 'function') {
        lecture.then(() => video.pause()).catch(() => {})
      }
    }
    video.addEventListener('loadeddata', demarrer)
    if (video.readyState >= 2) demarrer()

    let currentTarget = 0
    let seekPending = false

    const doSeek = () => {
      // On ne demande une nouvelle image que si le décodeur a fini la précédente
      if (!video.seeking) {
        seekPending = false
        video.currentTime = currentTarget
      } else {
        seekPending = true
      }
    }

    const onSeeked = () => {
      if (seekPending) doSeek()
    }
    video.addEventListener('seeked', onSeeked)

    const trigger = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const duration = video.duration
        if (!duration || Number.isNaN(duration)) return
        currentTarget = self.progress * duration
        doSeek()
      },
    })

    const onLoaded = () => ScrollTrigger.refresh()
    video.addEventListener('loadedmetadata', onLoaded)

    return () => {
      trigger.kill()
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('loadeddata', demarrer)
      video.removeEventListener('loadedmetadata', onLoaded)
    }
  }, [])

  // Parallaxe souris sur le conteneur
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || tactile) return

    const onMouseMove = (e) => {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 2
      const moveY = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(wrapper, { x: moveX * -30, y: moveY * -30, duration: 1.5, ease: 'power2.out' })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div
      ref={wrapperRef}
      className={`fixed top-0 left-0 w-full h-full z-0 origin-center ${
        tactile ? '' : 'scale-[1.05]'
      } ${className}`}
      // Le poster est peint par le conteneur : l'écran n'est jamais noir, même
      // avant que la première image ne soit décodée.
      style={{
        backgroundImage: 'url(' + poster + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {tactile ? (
        <canvas ref={canvasRef} className="w-full h-full block" aria-hidden="true" />
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover scale-[1.35]"
        />
      )}
    </div>
  )
}
