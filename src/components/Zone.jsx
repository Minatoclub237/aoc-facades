import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SIEGE = { nom: 'Lignan-sur-Orb', lat: 43.3597, lon: 3.1897 }

const COMMUNES = [
  { nom: 'Béziers', lat: 43.3442, lon: 3.2158 },
  { nom: 'Sérignan', lat: 43.2789, lon: 3.2764 },
  { nom: 'Capestang', lat: 43.3283, lon: 3.0417 },
  { nom: 'Valras-Plage', lat: 43.2464, lon: 3.2942 },
  { nom: 'Pézenas', lat: 43.4602, lon: 3.4234 },
  { nom: 'Agde', lat: 43.3097, lon: 3.4756 },
  { nom: 'Narbonne', lat: 43.1836, lon: 3.0039 },
  { nom: 'Sète', lat: 43.4029, lon: 3.6967 },
  { nom: 'Montpellier', lat: 43.6119, lon: 3.8772 },
]

// Distance réelle au siège : projection équirectangulaire, un degré de longitude
// valant cos(lat) degré de latitude à cette latitude.
const KM_PAR_DEGRE = 111

const distance = (ville) => {
  const dy = (ville.lat - SIEGE.lat) * KM_PAR_DEGRE
  const dx = (ville.lon - SIEGE.lon) * KM_PAR_DEGRE * Math.cos((SIEGE.lat * Math.PI) / 180)
  return Math.round(Math.hypot(dx, dy))
}

const VILLES = COMMUNES.map((ville) => ({ ...ville, km: distance(ville) })).sort(
  (a, b) => a.km - b.km,
)

// Position de l'atelier sur la carte, en pourcentage du cadre.
const REPERE = { x: 53.4, y: 71.8 }

// Le relief est reconstruit en CSS : le détourage ne pouvait pas distinguer
// l'extrusion d'origine du fond gris, tous deux dans les mêmes tons.
const EPAISSEUR = Array.from({ length: 9 }, (_, i) => i + 1)

const MASQUE = {
  maskImage: 'url(/zone/france.png)',
  WebkitMaskImage: 'url(/zone/france.png)',
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
}

/**
 * La carte de France bascule et dérive au scroll, l'atelier pulse dans l'Hérault,
 * et la liste des communes se dévoile ligne à ligne, accrochée au défilement.
 */
export default function Zone() {
  const sectionRef = useRef(null)
  const carteRef = useRef(null)
  const [allumees, setAllumees] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Chaque ligne monte derrière son masque, au rythme du scroll : le mouvement
      // est continu et réversible, pas un fondu déclenché une seule fois.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          end: '+=85%',
          scrub: 1.1,
        },
      })

      gsap.utils.toArray('.zone-ligne', sectionRef.current).forEach((ligne, i) => {
        tl.fromTo(
          ligne,
          { yPercent: 130, opacity: 0 },
          { yPercent: 0, opacity: 1, ease: 'power2.out', duration: 0.5 },
          i * 0.18,
        )
      })

      const compteur = { valeur: 0 }
      tl.to(
        compteur,
        {
          valeur: VILLES.length,
          ease: 'none',
          duration: (VILLES.length - 1) * 0.18 + 0.5,
          onUpdate: () => setAllumees(Math.round(compteur.valeur)),
        },
        0,
      )

      // La carte entre de plus loin et continue de dériver après la liste.
      gsap.fromTo(
        carteRef.current,
        { yPercent: 12, rotationX: 16, rotationZ: -5, scale: 0.93 },
        {
          yPercent: -10,
          rotationX: -6,
          rotationZ: 3,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="zone"
      ref={sectionRef}
      className="relative px-6 md:px-12 py-[14vh] overflow-hidden"
      aria-label="Zone d'intervention"
    >
      <div className="max-w-[1250px] mx-auto grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-sans uppercase tracking-[0.35em] text-xs md:text-sm text-or mb-4">
            Zone d'intervention
          </p>
          <h2 className="font-serif text-white text-3xl md:text-5xl lg:text-6xl leading-[1.1] mb-8">
            Basés à Lignan-sur-Orb,{' '}
            <span className="italic text-or">et pas très loin de chez vous</span>
          </h2>

          <div className="flex items-end gap-4 mb-8">
            <span className="font-serif text-or text-6xl md:text-7xl leading-none tabular-nums">
              {String(allumees).padStart(2, '0')}
            </span>
            <span className="font-sans text-white/55 text-sm leading-snug pb-2">
              communes desservies
              <br />
              sur l'axe Montpellier — Narbonne
            </span>
          </div>

          <ul className="font-sans text-sm border-t border-white/10">
            {VILLES.map((ville) => (
              <li key={ville.nom} className="overflow-hidden border-b border-white/10">
                <span className="zone-ligne flex items-baseline justify-between py-2.5 text-white">
                  {ville.nom}
                  <span className="text-or">{ville.km} km</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative" style={{ perspective: '1200px' }}>
          <div
            ref={carteRef}
            className="relative w-full aspect-[894/828]"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
            {/* Relief : des copies décalées du même masque, de la plus profonde à la plus proche. */}
            {EPAISSEUR.map((n) => (
              <span
                key={n}
                className="absolute inset-0"
                style={{
                  ...MASQUE,
                  transform: 'translate(' + n * -1.1 + 'px, ' + n * 2.2 + 'px)',
                  backgroundColor: n > 6 ? '#33261a' : '#6b5423',
                  opacity: 0.92 - n * 0.05,
                }}
                aria-hidden="true"
              />
            ))}

            {/* Face supérieure */}
            <span
              className="absolute inset-0"
              style={{
                ...MASQUE,
                background: 'linear-gradient(150deg, #f3ece0 0%, #ded2bd 55%, #c1b298 100%)',
              }}
              role="img"
              aria-label="Carte de France : l'atelier est situé dans l'Hérault"
            />

            {/* L'atelier */}
            <span
              className="absolute"
              style={{ left: REPERE.x + '%', top: REPERE.y + '%' }}
              aria-hidden="true"
            >
              <span className="zone-onde absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 block w-5 h-5 rounded-full border border-or" />
              <span className="zone-onde zone-onde-2 absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 block w-5 h-5 rounded-full border border-or" />
              <span
                className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 block w-3 h-3 rounded-full bg-or"
                style={{ boxShadow: '0 0 18px rgba(201,162,39,0.9)' }}
              />
              {/* Le libellé passe sur l'ivoire de la carte : il lui faut son propre fond. */}
              <span className="absolute left-5 -top-3 whitespace-nowrap font-sans text-[11px] tracking-[0.2em] uppercase text-or bg-fond/85 backdrop-blur-sm px-2.5 py-1 rounded-full border border-or/30">
                Lignan-sur-Orb
              </span>
            </span>
          </div>

          <p className="mt-8 font-sans text-white/40 text-xs md:text-sm text-center lg:text-left">
            Hérault et Aude — de Montpellier à Narbonne.
          </p>
        </div>
      </div>
    </section>
  )
}
