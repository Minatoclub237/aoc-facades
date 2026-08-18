import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Cta from './Cta'

gsap.registerPlugin(ScrollTrigger)

const METIERS = [
  {
    titre: 'Restauration\nde façades',
    texte: "Rénovation dans les règles de l'art.",
    media: 'metier-1',
  },
  {
    titre: "Application\nd'enduits",
    texte: 'Enduits traditionnels à la chaux et minéraux.',
    media: 'metier-2',
  },
  {
    titre: 'Peinture\nextérieure',
    texte: 'Peintures de qualité pour une finition durable.',
    media: 'metier-3',
  },
  {
    titre: 'Nettoyage\net traitement',
    texte: 'Nettoyage, traitement et protection des façades.',
    media: 'metier-4',
  },
  {
    titre: 'Finitions\nsoignées',
    texte: 'Des détails qui font toute la différence.',
    media: 'metier-5',
  },
]

/**
 * Les cinq métiers arrivent empilés puis se déploient en éventail 3D
 * pendant que la section est épinglée. Le paquet suit ensuite la souris.
 * Chaque carte est un plan de chantier en boucle, mis en lecture seulement
 * quand la section traverse l'écran.
 */
export default function Metiers() {
  const sectionRef = useRef(null)
  const deckRef = useRef(null)
  const cardsRef = useRef([])
  const videosRef = useRef([])

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

        // Faute de souris, la carte s'incline au passage : le relief reste.
        gsap.fromTo(
          card,
          { rotationX: 10, rotationY: -5, scale: 0.96 },
          {
            rotationX: -8,
            rotationY: 5,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.1 },
          },
        )
      })
    })

    return () => mm.revert()
  }, [])

  // Cinq décodeurs vidéo en parallèle : on ne les lance que pendant la traversée
  // de la section, et jamais si le visiteur a demandé moins d'animation.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const videos = videosRef.current.filter(Boolean)
    // IntersectionObserver plutôt que ScrollTrigger : la section est épinglée,
    // ce qui décale les bornes du trigger, et onToggle ne se déclenche pas quand
    // la section est déjà visible au moment de la création.
    const observer = new IntersectionObserver(
      ([entree]) => {
        videos.forEach((video) => {
          if (entree.isIntersecting) video.play().catch(() => {})
          else video.pause()
        })
      },
      { rootMargin: '300px 0px' },
    )
    observer.observe(sectionRef.current)

    return () => observer.disconnect()
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
    <section
      id="metiers"
      ref={sectionRef}
      className="relative md:h-screen overflow-hidden py-24 md:py-0"
      aria-label="Nos activités"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 55%, var(--color-fond-clair), transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div className="relative md:absolute md:top-[12vh] left-0 w-full px-6 md:px-12 text-center z-10">
        <p className="font-sans uppercase tracking-[0.35em] text-xs md:text-sm text-or mb-4">
          Nos activités
        </p>
        <h2 className="font-serif text-white text-3xl md:text-5xl lg:text-6xl">
          Cinq savoir-faire, <span className="italic text-or">une seule exigence</span>
        </h2>
      </div>

      <div
        className="relative md:absolute md:inset-0 flex items-center justify-center mt-12 md:mt-0"
        style={{ perspective: '1400px' }}
      >
        <div
          ref={deckRef}
          className="relative w-full flex flex-col items-center gap-8 md:gap-5 md:block md:h-[420px]"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          {METIERS.map((metier, i) => (
            <article
              key={metier.titre}
              ref={(el) => (cardsRef.current[i] = el)}
              className="metier-carte group relative [transform-style:preserve-3d] md:absolute md:left-1/2 md:top-1/2 w-[min(300px,84vw)] md:w-[260px] h-[420px] md:h-[380px] rounded-2xl border border-or/25 bg-fond-clair overflow-hidden"
              style={{ boxShadow: '0 30px 80px rgba(20, 14, 10, 0.55)' }}
            >
              <video
                ref={(el) => (videosRef.current[i] = el)}
                src={'/metiers/' + metier.media + '.mp4'}
                poster={'/metiers/' + metier.media + '.webp'}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />

              {/* Voiles : le bas porte le texte, le haut assied le numéro doré
                  qui se perdait sur les murs clairs. */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(20,14,10,0.94) 22%, rgba(20,14,10,0.55) 48%, rgba(20,14,10,0.12) 78%)',
                }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-x-0 top-0 h-32"
                style={{
                  background: 'linear-gradient(to bottom, rgba(20,14,10,0.6), transparent)',
                }}
                aria-hidden="true"
              />

              <div className="relative z-10 h-full p-6 md:p-7 flex flex-col justify-between">
                <span className="font-serif text-or text-2xl md:text-3xl drop-shadow">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif text-white text-2xl md:text-3xl leading-[1.1] whitespace-pre-line mb-3">
                    {metier.titre}
                  </h3>
                  <p className="font-sans text-white/65 text-sm leading-relaxed">{metier.texte}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="relative md:absolute md:bottom-[6vh] left-0 w-full px-6 mt-12 md:mt-0 flex flex-col items-center gap-6">
        <p className="text-center font-sans text-white/45 text-xs md:text-sm">
          Également : isolation thermique par l'extérieur (ITE), pose de plaques, plâtre et enduits
          intérieurs.
        </p>
        <Cta
          label="Quel traitement pour mon mur ?"
          href="#contact"
          messageWhatsapp="Bonjour, j'aimerais savoir quelle prestation correspond à ma façade. Voici quelques photos de mon mur :"
          labelWhatsapp="Envoyer une photo du mur"
        />
      </div>
    </section>
  )
}
