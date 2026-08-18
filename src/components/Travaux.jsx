import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Cta from './Cta'

gsap.registerPlugin(ScrollTrigger)

const TRAVAUX = [
  {
    id: 'ite',
    titre: 'Isolation thermique par l’extérieur',
    texte:
      "Les panneaux isolants habillent le mur existant, puis disparaissent sous l’enduit de finition. Le bâtiment change de classe énergétique sans perdre un centimètre à l’intérieur.",
    avant: '/travaux/ite-avant.webp',
    apres: '/travaux/ite-apres.webp',
  },
  {
    id: 'plaques',
    titre: 'Pose de plaques',
    texte:
      "Ossature métallique, isolant, plaques vissées et joints bandés : le mur brut devient une surface parfaitement plane, prête à peindre.",
    avant: '/travaux/plaques-avant.webp',
    apres: '/travaux/plaques-apres.webp',
  },
  {
    id: 'enduits',
    titre: 'Plâtre et enduits intérieurs',
    texte:
      "Rebouchage, dressage, ponçage. Le plâtre rattrape les défauts du support et donne aux murs anciens la netteté d’un neuf.",
    avant: '/travaux/enduits-avant.webp',
    apres: '/travaux/enduits-apres.webp',
  },
]

/**
 * Trois comparatifs, mais un geste différent de la section façade : ici le
 * visiteur mène lui-même la séparation avec sa souris, et le mouvement traîne
 * derrière le curseur (0,9 s) au lieu de le suivre à la trace. Sur mobile et
 * sur les écrans tactiles, le scroll prend le relais.
 */
export default function Travaux() {
  const sectionRef = useRef(null)
  const casesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const pointeurFin = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const nettoyages = []

      casesRef.current.filter(Boolean).forEach((element) => {
        const cadre = element.querySelector('.travaux-cadre')
        const voile = element.querySelector('.travaux-apres')
        const trait = element.querySelector('.travaux-trait')

        // Une seule fonction de rendu, quelle que soit la source du mouvement.
        const placer = (ratio) => {
          gsap.set(voile, { clipPath: 'inset(0 ' + (100 - ratio * 100) + '% 0 0)' })
          gsap.set(trait, { left: ratio * 100 + '%' })
        }
        placer(0.5)

        if (pointeurFin) {
          const suivi = { ratio: 0.5 }
          const glisser = (vers) =>
            gsap.to(suivi, {
              ratio: vers,
              duration: 0.9,
              ease: 'power3.out',
              overwrite: true,
              onUpdate: () => placer(suivi.ratio),
            })

          const onMove = (e) => {
            const { left, width } = cadre.getBoundingClientRect()
            glisser(gsap.utils.clamp(0.02, 0.98, (e.clientX - left) / width))
          }
          const onLeave = () => glisser(0.5)

          cadre.addEventListener('pointermove', onMove)
          cadre.addEventListener('pointerleave', onLeave)
          nettoyages.push(() => {
            cadre.removeEventListener('pointermove', onMove)
            cadre.removeEventListener('pointerleave', onLeave)
          })
        } else {
          const suivi = { ratio: 0.15 }
          gsap.to(suivi, {
            ratio: 0.9,
            ease: 'none',
            onUpdate: () => placer(suivi.ratio),
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              end: 'bottom 45%',
              scrub: 1.2,
            },
          })
        }

        gsap.fromTo(
          element,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 80%' },
          },
        )
      })

      return () => nettoyages.forEach((f) => f())
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="travaux"
      ref={sectionRef}
      className="relative px-4 md:px-12 py-[12vh]"
      aria-label="Travaux avant / après"
    >
      <div className="max-w-[1000px] mx-auto mb-14 md:mb-20">
        <p className="font-sans uppercase tracking-[0.35em] text-xs md:text-sm text-or mb-3">
          Avant / après
        </p>
        <h2 className="font-serif text-white text-3xl md:text-5xl lg:text-6xl leading-[1.05] mb-5">
          Isolation, plaques et <span className="italic text-or">enduits intérieurs</span>
        </h2>
        <p className="font-sans text-white/55 text-base md:text-lg max-w-2xl leading-relaxed">
          La façade n'est qu'une partie du travail. Promenez le curseur sur chaque image — ou
          laissez le scroll faire glisser la séparation.
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto space-y-20 md:space-y-28">
        {TRAVAUX.map((travail, i) => (
          <article key={travail.id} ref={(el) => (casesRef.current[i] = el)}>
            <div className="flex items-baseline gap-4 mb-5">
              <span className="font-serif text-or text-xl md:text-2xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-serif text-white text-2xl md:text-4xl leading-tight">
                {travail.titre}
              </h3>
            </div>

            <div className="travaux-cadre relative rounded-3xl overflow-hidden border border-white/10 aspect-[43/24] cursor-ew-resize">
              <img
                src={travail.avant}
                alt={'Avant : ' + travail.titre}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="travaux-apres absolute inset-0" style={{ willChange: 'clip-path' }}>
                <img
                  src={travail.apres}
                  alt={'Après : ' + travail.titre}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div
                className="travaux-trait absolute top-0 bottom-0 w-px bg-or"
                style={{ boxShadow: '0 0 20px rgba(201,162,39,0.5)' }}
                aria-hidden="true"
              >
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-or bg-fond/70 backdrop-blur-sm" />
              </div>

              {/* Le voile « après » se dévoile par la gauche : les étiquettes doivent
                  désigner le côté sur lequel elles sont posées. */}
              <span className="absolute bottom-4 left-4 font-sans uppercase tracking-[0.3em] text-[11px] text-or bg-fond/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                Après
              </span>
              <span className="absolute bottom-4 right-4 font-sans uppercase tracking-[0.3em] text-[11px] text-white/75 bg-fond/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                Avant
              </span>
            </div>

            <p className="font-sans text-white/55 text-sm md:text-base leading-relaxed mt-5 max-w-2xl">
              {travail.texte}
            </p>
          </article>
        ))}
      </div>

      <Cta
        className="max-w-[1000px] mx-auto mt-20 justify-center md:justify-start"
        label="Voir ce que ça donnerait chez moi"
        href="#contact"
        messageWhatsapp="Bonjour, j'ai vu vos avant / après. Voici une photo de mon mur, qu'est-ce que ça donnerait ?"
        labelWhatsapp="Envoyer mon mur en photo"
      />
    </section>
  )
}
