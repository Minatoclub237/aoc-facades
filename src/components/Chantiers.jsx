import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CHANTIERS = [
  {
    titre: 'Maison\nindividuelle',
    texte: "Ravalement complet, enduits de finition et traitement des supports, sans jamais immobiliser la maison plus que nécessaire.",
  },
  {
    titre: 'Immeuble',
    texte: "Interventions en hauteur sur copropriétés et bâtiments collectifs, avec un chantier propre et balisé du premier au dernier jour.",
  },
  {
    titre: 'Domaine\nviticole',
    texte: "Bâtiments d'exploitation et bâtisses de caractère de l'Hérault et de l'Aude : enduits à la chaux, respect des matériaux d'origine.",
  },
  {
    titre: 'Bâtiment\nancien',
    texte: "Pierre, chaux, badigeons : les techniques traditionnelles appliquées là où un enduit moderne abîmerait le mur.",
  },
]

/**
 * Défilement horizontal piloté par le scroll vertical. Chaque panneau a trois
 * plans qui avancent à des vitesses différentes : le chiffre géant en fond dérive
 * à contresens, le texte suit, le filet or ferme la marche.
 */
export default function Chantiers() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current
      const panels = gsap.utils.toArray('.chantier-panel', track)

      const scrollTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => '+=' + (track.scrollWidth - window.innerWidth),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Parallaxe interne : chaque plan se décale pendant que son panneau traverse l'écran.
      panels.forEach((panel) => {
        const commun = {
          trigger: panel,
          containerAnimation: scrollTween,
          start: 'left right',
          end: 'right left',
          scrub: 1,
        }
        gsap.fromTo(panel.querySelector('.chantier-chiffre'), { xPercent: 18 }, { xPercent: -18, ease: 'none', scrollTrigger: commun })
        gsap.fromTo(panel.querySelector('.chantier-texte'), { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: commun })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="chantiers" ref={sectionRef} className="relative h-screen overflow-hidden" aria-label="Types de chantiers">
      <div className="absolute top-[10vh] left-0 w-full px-6 md:px-12 z-10 pointer-events-none">
        <p className="font-sans uppercase tracking-[0.35em] text-xs md:text-sm text-or mb-3">
          Nos chantiers
        </p>
        <h2 className="font-serif text-white text-3xl md:text-5xl">
          De la maison de village au <span className="italic text-or">domaine viticole</span>
        </h2>
      </div>

      <div ref={trackRef} className="absolute inset-0 flex h-full w-max items-center">
        {CHANTIERS.map((chantier, i) => (
          <article
            key={chantier.titre}
            className="chantier-panel relative flex h-full w-screen shrink-0 flex-col justify-center px-8 md:px-24 overflow-hidden"
          >
            <span
              className="chantier-chiffre absolute inset-0 flex items-center justify-center font-dirtyline leading-none select-none pointer-events-none"
              style={{ fontSize: 'clamp(14rem, 42vw, 640px)', color: 'transparent', WebkitTextStroke: '1px rgba(201,162,39,0.45)' }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div className="chantier-texte relative max-w-xl">
              <h3 className="font-serif text-white text-4xl md:text-6xl lg:text-7xl leading-[1.05] whitespace-pre-line mb-6">
                {chantier.titre}
              </h3>
              <span className="block h-px w-16 bg-or mb-6" aria-hidden="true" />
              <p className="font-sans text-white/65 text-base md:text-lg leading-relaxed">
                {chantier.texte}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
