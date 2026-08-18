import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MARQUEE_ITEMS = ['WEBER', 'SIKA', 'PAREXLANKO', 'STO', 'KNAUF', 'ZOLPAN']

export default function GlassPanel() {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const panelRef = useRef(null)

  // Le panneau remonte depuis le bas en fin de scroll
  useEffect(() => {
    const container = containerRef.current
    const wrapper = wrapperRef.current
    if (!container || !wrapper) return

    const tween = gsap.fromTo(
      wrapper,
      { y: '100%' },
      {
        y: '0%',
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  // Parallaxe 3D à la souris
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    const onMouseMove = (e) => {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 2
      const moveY = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(panel, {
        x: moveX * 20,
        y: moveY * 20,
        rotationY: moveX * 4,
        rotationX: -moveY * 4,
        ease: 'power3.out',
        duration: 1,
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-0 w-full h-screen z-20 flex items-center justify-center p-4 md:p-8 pointer-events-none overflow-hidden"
    >
      <div
        ref={wrapperRef}
        className="w-full max-w-[1250px] h-[900px] max-h-[85vh] pointer-events-auto"
        style={{ perspective: '1000px' }}
      >
        <div
          ref={panelRef}
          className="w-full h-full flex flex-col justify-between rounded-3xl relative overflow-hidden"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.16)',
            backdropFilter: 'blur(160px)',
            WebkitBackdropFilter: 'blur(160px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center">
            <p className="font-serif italic text-white/70 text-base md:text-lg mb-4 md:mb-6">
              À propos
            </p>
            <div className="font-serif text-white text-xl md:text-3xl lg:text-[40px] leading-[1.35] tracking-tight w-full max-w-[1000px] mx-auto space-y-5 md:space-y-7">
              <p>
                Depuis plusieurs années, AOC Façades met son <span className="italic">expertise</span>{' '}
                au service de vos projets de rénovation extérieure. Nous accordons une importance
                particulière à la qualité du travail, au respect des délais et à la satisfaction de
                nos clients.
              </p>
              <p>
                Chaque chantier est réalisé avec <span className="italic">soin</span>, qu’il s’agisse
                d’une maison individuelle, d’un immeuble, d'un domaine viticole ou d’un bâtiment
                ancien. Notre objectif est simple : vous offrir un résultat durable,{' '}
                <span className="italic">d’exception</span> et à la hauteur de vos attentes.
              </p>
              <p className="text-white/70 text-lg md:text-xl lg:text-2xl">
                Contactez-nous dès aujourd’hui pour une étude personnalisée et un devis gratuit.
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 py-6 overflow-hidden">
            <div className="flex w-max animate-marquee">
              {Array.from({ length: 4 }).map((_, groupIndex) => (
                <div key={groupIndex} className="flex shrink-0">
                  {MARQUEE_ITEMS.map((name) => (
                    <span
                      key={`${groupIndex}-${name}`}
                      className="px-8 md:px-12 text-white opacity-40 hover:opacity-100 transition-opacity duration-300 uppercase font-sans font-semibold text-sm tracking-widest"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
