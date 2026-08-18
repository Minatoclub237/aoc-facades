import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Comparatif avant / après. Le voile « après » se retire de la droite vers la
 * gauche pendant que la section est épinglée : le chantier se fait sous les yeux
 * du visiteur, à la vitesse de son scroll. Les deux images dérivent en sens
 * inverse (parallaxe interne) pour éviter l'effet carte postale figée.
 */
export default function AvantApres() {
  const sectionRef = useRef(null)
  const apresRef = useRef(null)
  const poigneeRef = useRef(null)
  const imageAvantRef = useRef(null)
  const imageApresRef = useRef(null)
  const etiquetteAvantRef = useRef(null)
  const etiquetteApresRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=160%',
          scrub: 1.4,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.fromTo(
        apresRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', ease: 'none' },
        0,
      )
        .fromTo(poigneeRef.current, { left: '0%' }, { left: '100%', ease: 'none' }, 0)
        .fromTo(imageAvantRef.current, { scale: 1.12, xPercent: -2 }, { scale: 1, xPercent: 2, ease: 'none' }, 0)
        .fromTo(imageApresRef.current, { scale: 1.16, xPercent: 3 }, { scale: 1.02, xPercent: -2, ease: 'none' }, 0)
        .fromTo(etiquetteAvantRef.current, { opacity: 1 }, { opacity: 0, ease: 'none' }, 0.55)
        .fromTo(etiquetteApresRef.current, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.35)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="realisations"
      ref={sectionRef}
      className="relative h-screen overflow-hidden flex flex-col justify-center px-4 md:px-12 pt-24"
      aria-label="Avant / après"
    >
      <div className="max-w-[1250px] w-full mx-auto mb-6 md:mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-sans uppercase tracking-[0.35em] text-xs md:text-sm text-or mb-3">
            Avant / après
          </p>
          <h2 className="font-serif text-white text-3xl md:text-5xl lg:text-6xl leading-[1.05]">
            La même façade, <span className="italic text-or">trois semaines plus tard</span>
          </h2>
        </div>
        <p className="font-sans text-white/45 text-xs md:text-sm max-w-xs">
          Faites glisser la page : le ravalement se découvre au rythme de votre scroll.
        </p>
      </div>

      <div className="max-w-[1250px] w-full mx-auto relative rounded-3xl overflow-hidden border border-white/10 h-[52vh] md:h-[62vh]">
        <img
          ref={imageAvantRef}
          src="/placeholder-avant.svg"
          alt="Façade avant travaux"
          className="absolute inset-0 w-full h-full object-cover object-left-top"
        />

        <div ref={apresRef} className="absolute inset-0" style={{ willChange: 'clip-path' }}>
          <img
            ref={imageApresRef}
            src="/placeholder-apres.svg"
            alt="Façade après ravalement"
            className="absolute inset-0 w-full h-full object-cover object-left-top"
          />
        </div>

        {/* Trait de séparation qui traverse le cadre */}
        <div
          ref={poigneeRef}
          className="absolute top-0 bottom-0 w-px bg-or"
          style={{ left: '0%', boxShadow: '0 0 24px rgba(201,162,39,0.55)' }}
          aria-hidden="true"
        >
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-or bg-fond/70 backdrop-blur-sm" />
        </div>

        <span
          ref={etiquetteAvantRef}
          className="absolute bottom-5 left-5 font-sans uppercase tracking-[0.3em] text-xs text-white/80 bg-fond/60 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          Avant
        </span>
        <span
          ref={etiquetteApresRef}
          className="absolute bottom-5 right-5 font-sans uppercase tracking-[0.3em] text-xs text-or bg-fond/60 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          Après
        </span>
      </div>
    </section>
  )
}
