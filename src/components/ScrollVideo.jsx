import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollVideo({ src, className = '' }) {
  const videoRef = useRef(null)
  const wrapperRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  // Chargement : on suit la progression du buffer pour l'overlay
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onProgress = () => {
      if (!video.duration || !video.buffered.length) return
      const end = video.buffered.end(video.buffered.length - 1)
      setProgress(Math.min(100, Math.round((end / video.duration) * 100)))
    }
    const onCanPlay = () => {
      setProgress(100)
      setReady(true)
    }

    video.addEventListener('progress', onProgress)
    video.addEventListener('canplay', onCanPlay)
    return () => {
      video.removeEventListener('progress', onProgress)
      video.removeEventListener('canplay', onCanPlay)
    }
  }, [])

  // Scrub : le scroll pilote la position de lecture
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

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
      trigger: document.documentElement,
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
    if (!wrapper) return

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
    <>
      {!ready && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <span className="text-2xl font-sans text-white">Chargement… {progress}%</span>
        </div>
      )}
      <div
        ref={wrapperRef}
        className={`fixed top-0 left-0 w-full h-full z-0 scale-[1.05] origin-center ${className}`}
      >
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="w-full h-full object-cover scale-[1.35]"
        />
      </div>
    </>
  )
}
