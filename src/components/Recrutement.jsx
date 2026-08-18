import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TELEPHONE = '06 66 47 13 89'

const ATOUTS = [
  'Un travail soigné et durable',
  'Des matériaux de qualité',
  'Un savoir-faire artisanal',
  'Un engagement sur chaque chantier',
]

/**
 * Annonce de recrutement. Un ruban typographique traverse la bande en fond,
 * très lentement, pendant que les conditions se dévoilent ligne par ligne
 * derrière un masque qui remonte.
 */
export default function Recrutement() {
  const sectionRef = useRef(null)
  const rubanRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rubanRef.current,
        { xPercent: 2 },
        {
          xPercent: -32,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.6,
          },
        },
      )

      gsap.utils.toArray('.recrutement-ligne', sectionRef.current).forEach((ligne, i) => {
        gsap.fromTo(
          ligne,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: 'power3.out',
            delay: i * 0.09,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
          },
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative px-4 md:px-12 py-[12vh]" aria-label="Recrutement">
      <div className="max-w-[1250px] mx-auto relative rounded-3xl overflow-hidden border border-white/10 bg-surface/12 px-6 md:px-16 py-16 md:py-24">
        <div
          ref={rubanRef}
          className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-dirtyline leading-none select-none pointer-events-none"
          style={{
            fontSize: 'clamp(6rem, 16vw, 260px)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.09)',
          }}
          aria-hidden="true"
        >
          FACADIER FACADIER FACADIER FACADIER
        </div>

        <div className="relative max-w-3xl">
          <div className="overflow-hidden">
            <p className="recrutement-ligne font-sans uppercase tracking-[0.35em] text-xs md:text-sm text-or">
              Nous recrutons
            </p>
          </div>

          <div className="overflow-hidden mt-4 mb-8">
            <h2 className="recrutement-ligne font-serif text-white text-4xl md:text-6xl lg:text-7xl leading-[1.02]">
              Façadier <span className="italic text-or">(H/F)</span>
            </h2>
          </div>

          <div className="overflow-hidden mb-10">
            <p className="recrutement-ligne font-sans text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
              Nous cherchons un façadier sérieux et motivé pour rejoindre l'équipe sur le secteur
              de Montpellier à Narbonne. Chantiers variés, du pavillon au bâtiment ancien.
            </p>
          </div>

          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4 mb-12">
            {ATOUTS.map((atout) => (
              <li key={atout} className="overflow-hidden">
                <span className="recrutement-ligne flex items-baseline gap-3 font-sans text-white/80 text-sm md:text-base">
                  <span className="text-or" aria-hidden="true">
                    —
                  </span>
                  {atout}
                </span>
              </li>
            ))}
          </ul>

          <div className="overflow-hidden">
            <div className="recrutement-ligne flex flex-wrap items-center gap-5">
              <a
                href={'tel:+33' + TELEPHONE.replace(/\s/g, '').slice(1)}
                className="font-sans uppercase tracking-[0.2em] text-sm border border-or text-or px-8 py-4 rounded-full transition-colors duration-500 hover:bg-or hover:text-fond"
              >
                {TELEPHONE}
              </a>
              <span className="font-serif italic text-white/45 text-lg">
                Candidature par téléphone, directement auprès de l'équipe.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
