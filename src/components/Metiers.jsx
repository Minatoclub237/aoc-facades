import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const METIERS = [
  { titre: 'Restauration\nde façades', texte: "Rénovation dans les règles de l'art." },
  { titre: "Application\nd'enduits", texte: 'Enduits traditionnels à la chaux et minéraux.' },
  { titre: 'Peinture\nextérieure', texte: 'Peintures de qualité pour une finition durable.' },
  { titre: 'Nettoyage\net traitement', texte: 'Nettoyage, traitement et protection des façades.' },
  { titre: 'Finitions\nsoignées', texte: 'Des détails qui font toute la différence.' },
]

/**
 * Les cinq métiers arrivent empilés puis se déploient en éventail 3D
 * pendant que la section est épinglée. Le paquet suit ensuite la souris.
 */
export default function Metiers() {
  const sectionRef = useRef(null)
  const deckRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const mm = gsap.matchMedia()

    // Desktop : le paquet arrive empilé puis se déploie en éventail pendant le pin.
    mm.add('(min-width: 768px)', () => {
      const cards = cardsRef.current.filter(Boolean)
      const middle = (cards.length - 1) / 2
      // Écart calculé pour que les cartes ne se recouvrent pas tant que la place le permet.
      const ecart = () => {
        const dispo = Math.min(window.innerWidth - 48, 1300)
        return Math.min((dispo - 260) / (cards.length - 1), 268)
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=140%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      cards.forEach((card, i) => {
        const rank = i - middle
        tl.fromTo(
          card,
          { xPercent: -50, yPercent: -50, x: 0, y: 0, rotation: rank * 1.5, scale: 0.92, opacity: i === 0 ? 1 : 0.35 },
          {
            x: () => rank * ecart(),
            y: () => Math.abs(rank) * 18 - 18,
            rotation: rank * 7,
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
          },
          i * 0.08,
        )
      })
    })

    // Mobile : l'éventail devient une pile lisible, révélée carte par carte.
    mm.add('(max-width: 767px)', () => {
      gsap.utils.toArray('.metier-carte', sectionRef.current).forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          },
        )
      })
    })

    return () => mm.revert()
  }, [])

  useEffect(() => {
    const deck = deckRef.current
    if (!deck || window.matchMedia('(max-width: 767px)').matches) return

    const onMouseMove = (e) => {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 2
      const moveY = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(deck, {
        rotationY: moveX * 7,
        rotationX: -moveY * 5,
        duration: 1.2,
        ease: 'power3.out',
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <section id="metiers" ref={sectionRef} className="relative md:h-screen overflow-hidden py-24 md:py-0" aria-label="Nos activités">
      <div className="relative md:absolute md:top-[12vh] left-0 w-full px-6 md:px-12 text-center z-10">
        <p className="font-sans uppercase tracking-[0.35em] text-xs md:text-sm text-or mb-4">
          Nos activités
        </p>
        <h2 className="font-serif text-white text-3xl md:text-5xl lg:text-6xl">
          Cinq savoir-faire, <span className="italic text-or">une seule exigence</span>
        </h2>
      </div>

      <div className="relative md:absolute md:inset-0 flex items-center justify-center mt-12 md:mt-0" style={{ perspective: '1400px' }}>
        <div
          ref={deckRef}
          className="relative w-full flex flex-col items-center gap-5 md:block md:h-[420px]"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          {METIERS.map((metier, i) => (
            <article
              key={metier.titre}
              ref={(el) => (cardsRef.current[i] = el)}
              className="metier-carte relative md:absolute md:left-1/2 md:top-1/2 w-[min(300px,84vw)] md:w-[260px] h-auto md:h-[380px] rounded-2xl border border-or/30 bg-black/70 backdrop-blur-xl p-6 md:p-7 flex flex-col justify-between gap-10 md:gap-0"
              style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
            >
              <span className="font-serif text-or text-2xl md:text-3xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-serif text-white text-2xl md:text-3xl leading-[1.1] whitespace-pre-line mb-3">
                  {metier.titre}
                </h3>
                <p className="font-sans text-white/60 text-sm leading-relaxed">{metier.texte}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <p className="relative md:absolute md:bottom-[8vh] left-0 w-full px-6 mt-12 md:mt-0 text-center font-sans text-white/45 text-xs md:text-sm">
        Également : isolation thermique par l'extérieur (ITE), pose de plaques, plâtre et enduits
        intérieurs.
      </p>
    </section>
  )
}
