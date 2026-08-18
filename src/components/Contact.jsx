import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { whatsapp } from './Cta'

gsap.registerPlugin(ScrollTrigger)

const TELEPHONE = '06 66 47 13 89'
// À REMPLACER : adresse de réception des demandes de devis (non fournie par le client).
const EMAIL = 'contact@aoc-facades.fr'

const CHAMPS = [
  { id: 'nom', label: 'Nom', type: 'text', autoComplete: 'name' },
  { id: 'telephone', label: 'Téléphone', type: 'tel', autoComplete: 'tel' },
  { id: 'commune', label: 'Commune du chantier', type: 'text', autoComplete: 'address-level2' },
]

/**
 * Fin de parcours. Le bloc entier remonte derrière un masque, puis les champs
 * arrivent un à un en fondu long : le mouvement ralentit à mesure qu'on
 * approche de l'action, au lieu de s'emballer.
 */
export default function Contact() {
  const sectionRef = useRef(null)
  const carteRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.contact-ligne', sectionRef.current).forEach((ligne, i) => {
        gsap.fromTo(
          ligne,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          },
        )
      })

      gsap.fromTo(
        '.contact-champ',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' },
        },
      )

      gsap.fromTo(
        carteRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Sans back-end, la demande part par mail avec les champs pré-remplis.
  const envoyer = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const corps = [
      'Nom : ' + (data.get('nom') || ''),
      'Téléphone : ' + (data.get('telephone') || ''),
      'Commune : ' + (data.get('commune') || ''),
      '',
      data.get('projet') || '',
    ].join('\n')
    window.location.href =
      'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Demande de devis — AOC Façades') +
      '&body=' + encodeURIComponent(corps)
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative px-4 md:px-12 pt-[10vh] pb-24 overflow-hidden"
      aria-label="Contact"
    >
      {/* Fond photo laissé à pleine opacité : la lisibilité vient du poids des
          caractères et des panneaux de verre, jamais d'un voile sur l'image. */}
      <img
        src="/contact/contact.webp"
        alt="Artisan reprenant l'enduit d'une maison de village depuis un échafaudage"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 max-w-[1250px] mx-auto grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div className="rounded-3xl border border-white/10 bg-fond/70 backdrop-blur-xl p-7 md:p-10">
          <div className="overflow-hidden">
            <p className="contact-ligne font-sans font-bold uppercase tracking-[0.35em] text-xs md:text-sm text-or-clair">
              Contact
            </p>
          </div>
          <div className="overflow-hidden mt-5 mb-6">
            <h2 className="contact-ligne font-serif text-white text-4xl md:text-6xl lg:text-[68px] leading-[1.03]" style={{ textShadow: '0 2px 24px rgba(20,14,10,0.85)' }}>
              Parlons de <span className="italic text-or">votre façade</span>
            </h2>
          </div>
          <div className="overflow-hidden mb-12">
            <p className="contact-ligne font-sans font-medium text-white/80 text-base md:text-lg max-w-lg leading-relaxed">
              Décrivez-nous le bâtiment en deux lignes. Nous passons le voir, puis vous recevez
              une étude personnalisée et un devis gratuit.
            </p>
          </div>

          <form onSubmit={envoyer} className="max-w-lg">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {CHAMPS.map((champ) => (
                <div key={champ.id} className={'contact-champ' + (champ.id === 'commune' ? ' sm:col-span-2' : '')}>
                  <label
                    htmlFor={champ.id}
                    className="block font-sans font-bold uppercase tracking-[0.2em] text-[11px] text-white/70 mb-2"
                  >
                    {champ.label}
                  </label>
                  <input
                    id={champ.id}
                    name={champ.id}
                    type={champ.type}
                    autoComplete={champ.autoComplete}
                    required
                    className="w-full bg-transparent border-b border-white/35 pb-3 font-sans font-semibold text-white text-base outline-none transition-colors duration-500 focus:border-or"
                  />
                </div>
              ))}

              <div className="contact-champ sm:col-span-2">
                <label
                  htmlFor="projet"
                  className="block font-sans font-bold uppercase tracking-[0.2em] text-[11px] text-white/70 mb-2"
                >
                  Votre projet
                </label>
                <textarea
                  id="projet"
                  name="projet"
                  rows="3"
                  className="w-full bg-transparent border-b border-white/35 pb-3 font-sans font-semibold text-white text-base outline-none resize-none transition-colors duration-500 focus:border-or"
                />
              </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="contact-champ font-sans uppercase tracking-[0.2em] text-sm bg-or text-fond font-semibold px-9 py-4 rounded-full transition-colors duration-500 hover:bg-or-clair"
              >
                Demander mon devis gratuit
              </button>
              <a
                href={whatsapp(
                  "Bonjour, je souhaite un devis pour ma façade. Adresse du chantier : ______",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-champ font-sans uppercase tracking-[0.2em] text-sm border border-whatsapp/60 text-whatsapp px-9 py-4 rounded-full transition-colors duration-500 hover:bg-whatsapp hover:text-fond"
              >
                Ou sur WhatsApp
              </a>
            </div>
          </form>
        </div>

        <aside
          ref={carteRef}
          className="rounded-3xl border border-white/10 bg-fond/70 backdrop-blur-xl p-8 md:p-10 h-fit lg:sticky lg:top-28"
        >
          <p className="font-sans font-bold uppercase tracking-[0.2em] text-[11px] text-white/70 mb-4">
            Par téléphone
          </p>
          <a
            href={'tel:+33' + TELEPHONE.replace(/\s/g, '').slice(1)}
            className="font-serif text-or text-4xl md:text-5xl leading-none block mb-10 transition-opacity duration-500 hover:opacity-70"
          >
            {TELEPHONE}
          </a>

          <dl className="space-y-7 font-sans text-sm border-t border-white/10 pt-8">
            <div>
              <dt className="text-white/60 font-bold uppercase tracking-[0.2em] text-[11px] mb-2">Atelier</dt>
              <dd className="text-white/85 font-medium leading-relaxed">
                5 placette des Rosiers
                <br />
                34490 Lignan-sur-Orb, Hérault
              </dd>
            </div>
            <div>
              <dt className="text-white/60 font-bold uppercase tracking-[0.2em] text-[11px] mb-2">
                Interventions
              </dt>
              <dd className="text-white/85 font-medium leading-relaxed">
                De Montpellier à Narbonne
                <br />
                Hérault et Aude
              </dd>
            </div>
            <div>
              <dt className="text-white/60 font-bold uppercase tracking-[0.2em] text-[11px] mb-2">Horaires</dt>
              <dd className="text-white/40 leading-relaxed italic">
                Du lundi au vendredi — à compléter
              </dd>
            </div>
          </dl>

          <p className="font-serif italic text-white/35 text-lg mt-10">
            Notre exigence, votre satisfaction.
          </p>
        </aside>
      </div>

    </section>
  )
}
