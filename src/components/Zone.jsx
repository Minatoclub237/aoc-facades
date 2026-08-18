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

const ANNEAUX = [15, 30, 60]

// Projection équirectangulaire centrée sur le siège : à cette latitude un degré
// de longitude vaut cos(lat) degré de latitude, sinon la carte s'étire vers l'est.
const KM_PAR_DEGRE = 111
const RAYON_MAX_PX = 240
const PX_PAR_KM = RAYON_MAX_PX / 68
const CENTRE = 300

const projeter = (ville) => {
  const dy = (ville.lat - SIEGE.lat) * KM_PAR_DEGRE
  const dx = (ville.lon - SIEGE.lon) * KM_PAR_DEGRE * Math.cos((SIEGE.lat * Math.PI) / 180)
  return {
    ...ville,
    km: Math.round(Math.hypot(dx, dy)),
    x: CENTRE + dx * PX_PAR_KM,
    y: CENTRE - dy * PX_PAR_KM,
  }
}

const VILLES = COMMUNES.map(projeter).sort((a, b) => a.km - b.km)

/**
 * Carte-radar : les anneaux kilométriques s'ouvrent depuis l'atelier, puis les
 * communes s'allument de la plus proche à la plus lointaine, en même temps que
 * la ligne correspondante de la liste.
 */
export default function Zone() {
  const sectionRef = useRef(null)
  const [allumees, setAllumees] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          // Distance fixe plutôt que « bottom bottom » : la zone est la dernière
          // section, le bas de page n'est atteint qu'à l'extrême fin du scroll et
          // la dernière commune ne s'allumait jamais.
          end: '+=70%',
          scrub: 1.2,
        },
      })

      gsap.utils.toArray('.zone-anneau', sectionRef.current).forEach((anneau, i) => {
        tl.fromTo(
          anneau,
          { scale: 0.2, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'power2.out', duration: 0.5 },
          i * 0.18,
        )
      })

      VILLES.forEach((ville, i) => {
        tl.fromTo(
          sectionRef.current.querySelectorAll('[data-ville="' + ville.nom + '"]'),
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.35 },
          0.9 + i * 0.16,
        )
      })

      // Compteur piloté par un tween proxy : une callback par ville manquait la
      // dernière commune quand le scrub s'arrêtait juste avant la fin.
      const compteur = { valeur: 0 }
      tl.to(
        compteur,
        {
          valeur: VILLES.length,
          ease: 'none',
          duration: (VILLES.length - 1) * 0.16 + 0.35,
          onUpdate: () => setAllumees(Math.round(compteur.valeur)),
        },
        0.9,
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="zone"
      ref={sectionRef}
      className="relative px-6 md:px-12 py-[14vh]"
      aria-label="Zone d'intervention"
    >
      <div className="max-w-[1250px] mx-auto grid gap-14 lg:grid-cols-2 lg:items-center">
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

          <ul className="font-sans text-sm divide-y divide-white/10 border-y border-white/10">
            {VILLES.map((ville) => (
              <li
                key={ville.nom}
                data-ville={ville.nom}
                className="flex items-baseline justify-between py-2.5 text-white"
                style={{ opacity: 0 }}
              >
                <span>{ville.nom}</span>
                <span className="text-or">{ville.km} km</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <svg
            viewBox="0 0 600 600"
            className="w-full h-auto"
            role="img"
            aria-label="Carte des communes desservies autour de Lignan-sur-Orb"
          >
            <defs>
              <radialGradient id="zoneCoeur">
                <stop offset="0%" stopColor="var(--color-surface)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--color-surface)" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx={CENTRE} cy={CENTRE} r="160" fill="url(#zoneCoeur)" />

            {ANNEAUX.map((km) => (
              <g
                key={km}
                className="zone-anneau"
                style={{ transformOrigin: CENTRE + 'px ' + CENTRE + 'px' }}
              >
                <circle
                  cx={CENTRE}
                  cy={CENTRE}
                  r={km * PX_PAR_KM}
                  fill="none"
                  stroke="var(--color-or)"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                />
                <text
                  x={CENTRE + 8}
                  y={CENTRE - km * PX_PAR_KM - 8}
                  fill="var(--color-or)"
                  fillOpacity="0.6"
                  fontFamily="Manrope, sans-serif"
                  fontSize="12"
                  letterSpacing="1"
                >
                  {km} km
                </text>
              </g>
            ))}

            {VILLES.map((ville) => {
              const aDroite = ville.x >= CENTRE
              return (
                <g key={ville.nom} data-ville={ville.nom} style={{ opacity: 0 }}>
                  <line
                    x1={CENTRE}
                    y1={CENTRE}
                    x2={ville.x}
                    y2={ville.y}
                    stroke="var(--color-or)"
                    strokeOpacity="0.18"
                    strokeWidth="1"
                  />
                  <circle cx={ville.x} cy={ville.y} r="4.5" fill="var(--color-or)" />
                  <text
                    x={ville.x + (aDroite ? 12 : -12)}
                    y={ville.y + 4}
                    textAnchor={aDroite ? 'start' : 'end'}
                    fill="#ffffff"
                    fontFamily="Manrope, sans-serif"
                    fontSize="15"
                    fontWeight="600"
                  >
                    {ville.nom}
                  </text>
                </g>
              )
            })}

            <g>
              <circle cx={CENTRE} cy={CENTRE} r="14" fill="var(--color-or)" fillOpacity="0.25" />
              <circle cx={CENTRE} cy={CENTRE} r="6" fill="var(--color-or)" />
              <text
                x={CENTRE - 20}
                y={CENTRE - 20}
                textAnchor="end"
                fill="var(--color-or)"
                fontFamily="Manrope, sans-serif"
                fontSize="13"
                fontWeight="600"
                letterSpacing="2"
              >
                L&apos;ATELIER
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
