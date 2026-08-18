import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Déplacer la tête de lecture image par image (`currentTime`) ne fonctionne pas
// de façon fiable sur Safari iOS : l'élément reste noir. Sur tactile on renonce
// donc au scrub et on joue la vidéo en boucle, ce qui, lui, marche partout.
const tactile = typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches

export default function ScrollVideo({ src, srcMobile, poster, className = '' }) {
  const videoRef = useRef(null)
  const wrapperRef = useRef(null)
  // 14 Mo sur un réseau mobile, c'est une minute d'attente : les petits écrans
  // reçoivent une version allégée.
  const [source] = useState(() =>
    srcMobile && window.matchMedia('(max-width: 900px)').matches ? srcMobile : src,
  )

  // Amorçage : iOS ne peint aucune image tant que la lecture n'a pas démarré.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const demarrer = () => {
      const lecture = video.play()
      if (lecture && typeof lecture.then === 'function') {
        lecture.then(() => {
          if (!tactile) video.pause()
        }).catch(() => {})
      }
    }

    video.addEventListener('loadeddata', demarrer)
    if (video.readyState >= 2) demarrer()

    return () => video.removeEventListener('loadeddata', demarrer)
  }, [])

  // Scrub : réservé aux écrans avec souris.
  useEffect(() => {
    const video = videoRef.current
    if (!video || tactile) return

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
      video.removeEventListener('loadedmetadata', onLoaded)
    }
  }, [])

  // Parallaxe souris sur le conteneur vidéo
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || tactile) return

    const onMouseMove = (e) => {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 2
      const moveY = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(wrapper, {
        x: moveX * -30,
        y: moveY * -30,
        duration: 1.5,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div
      ref={wrapperRef}
      className={`fixed top-0 left-0 w-full h-full z-0 scale-[1.05] origin-center ${className}`}
      // Le poster est peint par le conteneur : quelque chose est visible dès la
      // première seconde, sans écran de chargement qui bloque la page.
      style={{
        backgroundImage: 'url(' + poster + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <video
        ref={videoRef}
        src={source}
        poster={poster}
        muted
        loop={tactile}
        autoPlay={tactile}
        playsInline
        preload="auto"
        className="w-full h-full object-cover scale-[1.35]"
      />
    </div>
  )
}
