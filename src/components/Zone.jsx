import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Positions indicatives sur l'axe Narbonne -> Montpellier (ouest vers est).
const VILLES = [
  { nom: 'Narbonne', x: 60, y: 176 },
  { nom: 'Béziers', x: 300, y: 132 },
  { nom: 'Lignan-sur-Orb', x: 420, y: 118, siege: true },
  { nom: 'Pézenas', x: 620, y: 96 },
  { nom: 'Montpellier', x: 900, y: 54 },
]

const TRACE = 'M 60 176 C 200 168, 220 140, 300 132 S 380 122, 420 118 S 540 106, 620 96 S 800 70, 900 54'

/**
 * Le trait Narbonne -> Montpellier se dessine au scroll, les villes s'allument
 * l'une après l'autre au passage du tracé.
 */
export default function Zone() {
  const sectionRef = useRef(null)
  const pathRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const path = pathRef.current
      const longueur = path.getTotalLength()
      gsap.set(path, { strokeDasharray: longueur, strokeDashoffset: longueur })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 70%',
          scrub: 1.2,
        },
      })

      tl.to(path, { strokeDashoffset: 0, ease: 'none' }, 0)
      gsap.utils.toArray('.zone-ville', sectionRef.current).forEach((ville, i) => {
        tl.fromTo(
          ville,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.15 },
          i / VILLES.length,
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-[14vh] px-6 md:px-12" aria-label="Zone d'intervention">
      <div className="max-w-[1250px] mx-auto">
        <p className="font-sans uppercase tracking-[0.35em] text-xs md:text-sm text-or mb-3">
          Zone d'intervention
        </p>
        <h2 className="font-serif text-white text-3xl md:text-5xl lg:text-6xl mb-4">
          De Montpellier <span className="italic text-or">à Narbonne</span>
        </h2>
        <p className="font-sans text-white/60 text-base md:text-lg max-w-2xl mb-12">
          Notre atelier est installé à Lignan-sur-Orb, dans l'Hérault. Nous intervenons sur tout
          l'axe littoral, de l'agglomération de Montpellier jusqu'au Narbonnais.
        </p>

        <svg viewBox="0 0 1000 240" className="w-full h-auto" role="img" aria-label="Axe d'intervention de Narbonne à Montpellier">
          <path
            ref={pathRef}
            d={TRACE}
            fill="none"
            stroke="var(--color-or)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {VILLES.map((ville) => (
            <g key={ville.nom} className="zone-ville">
              <circle
                cx={ville.x}
                cy={ville.y}
                r={ville.siege ? 7 : 4}
                fill={ville.siege ? 'var(--color-or)' : '#000'}
                stroke="var(--color-or)"
                strokeWidth="2"
              />
              <text
                x={ville.x}
                y={ville.y - 20}
                textAnchor="middle"
                fill={ville.siege ? 'var(--color-or)' : '#ffffff'}
                fontFamily="Manrope, sans-serif"
                fontSize="17"
                fontWeight="600"
                letterSpacing="1"
              >
                {ville.nom}
              </text>
              {ville.siege && (
                <text
                  x={ville.x}
                  y={ville.y + 30}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.5)"
                  fontFamily="Manrope, sans-serif"
                  fontSize="13"
                  letterSpacing="2"
                >
                  SIÈGE
                </text>
              )}
            </g>
          ))}
        </svg>

        <p className="font-sans text-white/45 text-sm mt-8">
          Béziers · Pézenas · Agde · Sérignan · Capestang · Narbonne · Montpellier et alentours.
        </p>
      </div>
    </section>
  )
}
