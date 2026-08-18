import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Annonce de recrutement : un seul mouvement, le cadre or qui se referme. */
export default function Recrutement() {
  const sectionRef = useRef(null)
  const cadreRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cadreRef.current,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'center 60%', scrub: 1 },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative px-6 md:px-12 py-[10vh]" aria-label="Recrutement">
      <div className="max-w-[1250px] mx-auto relative">
        <div ref={cadreRef} className="absolute inset-0 border border-or rounded-2xl" aria-hidden="true" />
        <div className="relative px-6 md:px-16 py-12 md:py-16 text-center">
          <p className="font-sans uppercase tracking-[0.35em] text-xs md:text-sm text-or mb-5">
            Nous recrutons
          </p>
          <h2 className="font-serif text-white text-4xl md:text-6xl mb-6">
            Façadier <span className="italic text-or">(H/F)</span>
          </h2>
          <p className="font-sans text-white/60 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            AOC Façades recherche un façadier sérieux et motivé pour rejoindre son équipe sur le
            secteur de Montpellier à Narbonne. Travail soigné, matériaux de qualité, savoir-faire
            artisanal.
          </p>
          <a
            href="tel:+33666471389"
            className="inline-block font-sans uppercase tracking-[0.2em] text-sm border border-or text-or px-8 py-4 rounded-full transition-colors duration-300 hover:bg-or hover:text-black"
          >
            06 66 47 13 89
          </a>
        </div>
      </div>
    </section>
  )
}
