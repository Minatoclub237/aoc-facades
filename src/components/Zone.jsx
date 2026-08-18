import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SIEGE = { nom: 'Lignan-sur-Orb', lat: 43.3597, lon: 3.1897 }

// Les décalages d'étiquette sont posés à la main : autour de Béziers les
// communes sont à quelques kilomètres les unes des autres et les libellés se
// chevaucheraient quel que soit le placement automatique.
const COMMUNES = [
  { nom: 'Béziers', lat: 43.3442, lon: 3.2158, dx: 13, dy: 5, ancre: 'start' },
  { nom: 'Sérignan', lat: 43.2789, lon: 3.2764, dx: 13, dy: 6, ancre: 'start' },
  { nom: 'Capestang', lat: 43.3283, lon: 3.0417, dx: -13, dy: 4, ancre: 'end' },
  { nom: 'Valras-Plage', lat: 43.2464, lon: 3.2942, dx: 13, dy: 24, ancre: 'start' },
  { nom: 'Pézenas', lat: 43.4602, lon: 3.4234, dx: 13, dy: -8, ancre: 'start' },
  { nom: 'Agde', lat: 43.3097, lon: 3.4756, dx: 13, dy: -12, ancre: 'start' },
  { nom: 'Narbonne', lat: 43.1836, lon: 3.0039, dx: -13, dy: 6, ancre: 'end' },
  { nom: 'Sète', lat: 43.4029, lon: 3.6967, dx: 13, dy: 6, ancre: 'start' },
  { nom: 'Montpellier', lat: 43.6119, lon: 3.8772, dx: -13, dy: -10, ancre: 'end' },
]

// Projection équirectangulaire centrée sur le siège : à cette latitude, un degré
// de longitude vaut cos(lat) degré de latitude, sinon la carte s'étire vers l'est.
const KM_PAR_DEGRE = 111
const CENTRE = 300
const PX_PAR_KM = 212 / 68
const ANNEAUX = [15, 30, 60]

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

// Position de l'atelier sur la carte de France, en pourcentage du cadre.
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
 * La France en relief donne le contexte, la loupe posée sur l'Hérault donne le
 * détail : à l'échelle du pays, les neuf communes tiendraient dans un pixel.
 * Liste et loupe se remplissent ensemble, accrochées au scroll.
 */
export default function Zone() {
  const sectionRef = useRef(null)
  const carteRef = useRef(null)
  const [allumees, setAllumees] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          end: '+=95%',
          scrub: 1.1,
        },
      })

      // Les anneaux de la loupe s'ouvrent d'abord.
      gsap.utils.toArray('.zone-anneau', sectionRef.current).forEach((anneau, i) => {
        tl.fromTo(
          anneau,
          { scale: 0.15, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'power2.out', duration: 0.5 },
          i * 0.12,
        )
      })

      // Puis chaque commune : la ligne monte derrière son masque et le point
      // s'allume sur la loupe, au même instant de la timeline.
      VILLES.forEach((ville, i) => {
        const position = 0.5 + i * 0.18
        tl.fromTo(
          sectionRef.current.querySelector('.zone-ligne[data-ville="' + ville.nom + '"]'),
          { yPercent: 130, opacity: 0 },
          { yPercent: 0, opacity: 1, ease: 'power2.out', duration: 0.5 },
          position,
        )
        tl.fromTo(
          sectionRef.current.querySelector('.zone-point[data-ville="' + ville.nom + '"]'),
          { opacity: 0, scale: 0.3, transformOrigin: ville.x + 'px ' + ville.y + 'px' },
          { opacity: 1, scale: 1, ease: 'back.out(2)', duration: 0.45 },
          position,
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
        0.5,
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
                <span
                  className="zone-ligne flex items-baseline justify-between py-2.5 text-white"
                  data-ville={ville.nom}
                >
                  {ville.nom}
                  <span className="text-or">{ville.km} km</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative pb-[22%]" style={{ perspective: '1200px' }}>
          <div
            ref={carteRef}
            className="relative w-[84%] ml-auto aspect-[894/828]"
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
            </span>
          </div>

          {/* Trait de rappel entre le repère et la loupe */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1={16 + REPERE.x * 0.84}
              y1={REPERE.y * 0.78}
              x2="30"
              y2="70"
              stroke="var(--color-or)"
              strokeOpacity="0.45"
              strokeWidth="0.25"
              strokeDasharray="1.2 1.2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* La loupe : le détail de la zone réellement desservie */}
          <div className="absolute left-0 bottom-0 w-[54%] max-w-[330px] aspect-square rounded-full border border-or/35 bg-fond/85 backdrop-blur-sm overflow-hidden shadow-[0_30px_60px_rgba(20,14,10,0.6)]">
            <svg viewBox="0 0 600 600" className="w-full h-full" aria-hidden="true">
              <defs>
                <radialGradient id="zoneCoeur">
                  <stop offset="0%" stopColor="var(--color-or)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--color-or)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx={CENTRE} cy={CENTRE} r="190" fill="url(#zoneCoeur)" />

              {ANNEAUX.map((km) => (
                <circle
                  key={km}
                  className="zone-anneau"
                  cx={CENTRE}
                  cy={CENTRE}
                  r={km * PX_PAR_KM}
                  fill="none"
                  stroke="var(--color-or)"
                  strokeOpacity="0.3"
                  strokeWidth="1.4"
                  strokeDasharray="5 9"
                  style={{ transformOrigin: CENTRE + 'px ' + CENTRE + 'px' }}
                />
              ))}

              {VILLES.map((ville) => (
                <g key={ville.nom} className="zone-point" data-ville={ville.nom} style={{ opacity: 0 }}>
                  <line
                    x1={CENTRE}
                    y1={CENTRE}
                    x2={ville.x}
                    y2={ville.y}
                    stroke="var(--color-or)"
                    strokeOpacity="0.22"
                    strokeWidth="1.2"
                  />
                  <circle cx={ville.x} cy={ville.y} r="5" fill="var(--color-or)" />
                  <text
                    x={ville.x + ville.dx}
                    y={ville.y + ville.dy}
                    textAnchor={ville.ancre}
                    fill="#ffffff"
                    fontFamily="Manrope, sans-serif"
                    fontSize="16"
                    fontWeight="600"
                  >
                    {ville.nom}
                  </text>
                </g>
              ))}

              <circle cx={CENTRE} cy={CENTRE} r="16" fill="var(--color-or)" fillOpacity="0.25" />
              <circle cx={CENTRE} cy={CENTRE} r="7" fill="var(--color-or)" />
              <text
                x={CENTRE}
                y={CENTRE - 26}
                textAnchor="middle"
                fill="var(--color-or)"
                fontFamily="Manrope, sans-serif"
                fontSize="17"
                fontWeight="600"
                letterSpacing="2"
              >
                L&apos;ATELIER
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
