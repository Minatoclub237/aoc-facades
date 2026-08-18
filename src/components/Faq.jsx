import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Cta, { EMAIL, TEL_LIEN, whatsapp } from './Cta'
import { scrollTo } from '../smoothScroll'

gsap.registerPlugin(ScrollTrigger)

/**
 * Trois familles d'objections, dans l'ordre où elles viennent vraiment :
 * le prix qu'on compare, la peur que ça ne tienne pas, le dérangement.
 * Chaque réponse mène à une action différente — jamais deux fois la même.
 *
 * À FAIRE CONFIRMER PAR LE CLIENT avant mise en ligne : détention d'une
 * attestation de garantie décennale, durées de chantier annoncées, politique
 * d'avenant. Aucune de ces réponses n'invente de chiffre, mais elles engagent.
 */
const FAMILLES = [
  {
    cle: 'devis',
    titre: 'Le devis',
    questions: [
      {
        q: 'Vous êtes plus cher que le devis que j’ai reçu à côté.',
        a: "C'est possible, et ça se vérifie en trente secondes : posez les deux devis côte à côte et cherchez la préparation du support. Un ravalement, c'est d'abord un lavage, un traitement des mousses, un rebouchage et une impression — l'enduit ne représente qu'une partie du travail. Un prix bas cache presque toujours une ligne manquante : l'échafaudage, la protection des menuiseries, le nombre de couches, l'évacuation des gravats. Envoyez-nous l'autre devis, nous vous dirons ce qui n'y figure pas. S'il est complet et moins cher, nous vous le dirons aussi.",
        cta: {
          label: 'Faire comparer mon devis',
          href: whatsapp(
            "Bonjour, j'ai un devis de ravalement d'une autre entreprise et j'aimerais le comparer avec vous. Je vous l'envoie ici.",
          ),
          externe: true,
        },
      },
      {
        q: 'Vous ne pouvez pas me donner un prix au téléphone ?',
        a: "Un prix au mètre carré donné sans avoir vu le mur est un prix qui bougera. Ce qui fait varier un ravalement du simple au double, ce n'est pas la surface : c'est l'état du support, la présence de fissures, l'accès pour l'échafaudage, la hauteur, et ce qu'il y a sous l'ancien enduit. Nous préférons passer voir, gratuitement, et vous remettre un chiffre qui tiendra jusqu'à la fin du chantier plutôt qu'une fourchette téléphonique agréable à entendre et fausse.",
        cta: { label: 'Prendre rendez-vous pour la visite', href: '#contact' },
      },
      {
        q: 'Est-ce que le prix va bouger en cours de chantier ?',
        a: "Une seule chose peut le faire bouger : ce que l'on découvre en piquant l'ancien enduit — un mur creux, du salpêtre, une reprise de maçonnerie invisible depuis la rue. Quand cela arrive, vous êtes prévenu le jour même, avec une photo, et rien ne repart avant que vous ayez validé. Ce qui ne doit jamais arriver, c'est de le découvrir sur la facture finale. Demandez-nous comment nous traitons ce cas précis, c'est une question que peu de clients pensent à poser.",
        cta: { label: 'Poser la question de vive voix', href: TEL_LIEN },
      },
    ],
  },
  {
    cle: 'tenue',
    titre: 'La tenue dans le temps',
    questions: [
      {
        q: 'Votre société vient d’être créée. Pourquoi vous confier ma façade ?',
        a: "La société est jeune, les mains ne le sont pas : près de trente ans passés sur des façades, du pavillon au bâtiment ancien, avant de monter cette structure. Nous préférons le dire nous-mêmes plutôt que vous laisser le découvrir sur un annuaire d'entreprises. Ce qui compte pour vous n'est pas la date d'immatriculation, c'est de voir des murs finis et de pouvoir juger le travail. Les comparatifs avant / après de ce site sont des chantiers réels, pas des images d'agence.",
        cta: { label: 'Voir les avant / après', href: '#travaux' },
      },
      {
        q: 'J’ai des fissures. Elles vont revenir sous le nouvel enduit ?',
        a: "Tout dépend de laquelle il s'agit. Une fissure de retrait, fine et stable, se traite et disparaît pour de bon. Une fissure structurelle — celle qui traverse, qui s'élargit, qui suit un angle d'ouverture — ne se recouvre pas : un enduit posé dessus rouvre en deux hivers, et vous aurez payé deux fois. Dans ce cas, nous vous le disons avant de chiffrer, quitte à vous orienter vers un autre corps de métier. Envoyez-nous une photo de près et une de loin, on sait souvent trancher sur photo.",
        cta: {
          label: 'Envoyer la photo de ma fissure',
          href: whatsapp(
            "Bonjour, j'ai des fissures sur ma façade et j'aimerais votre avis. Je vous envoie une photo de près et une de loin.",
          ),
          externe: true,
        },
      },
      {
        q: 'Et si le travail se dégrade dans trois ans, je fais quoi ?',
        a: "Vous invoquez l'assurance — encore faut-il qu'elle existe. Un ravalement qui a une fonction d'imperméabilisation engage la garantie décennale de l'entreprise. Réclamez l'attestation avant le premier coup de truelle, la nôtre comme celle de tous les devis que vous comparez, et vérifiez qu'elle couvre bien l'activité et l'année en cours. C'est le document que les entreprises sérieuses envoient sans discuter, et celui que les autres promettent d'envoyer plus tard.",
        cta: {
          label: 'Demander l’attestation d’assurance',
          href:
            'mailto:' +
            EMAIL +
            '?subject=' +
            encodeURIComponent("Attestation d'assurance décennale"),
        },
      },
    ],
  },
  {
    cle: 'chantier',
    titre: 'Le chantier',
    questions: [
      {
        q: 'Combien de temps vais-je avoir un échafaudage devant mes fenêtres ?',
        a: "Une maison individuelle se compte en semaines, pas en mois — et l'essentiel de ce temps n'est pas du travail bruyant, c'est du séchage entre les couches, qui dépend de la météo. Ce que vous devez exiger, de nous comme d'un autre, c'est une date de début, une durée annoncée à la signature et un point si la pluie décale le planning. Un chantier qui traîne sans explication est un chantier mal organisé, pas une fatalité.",
        cta: { label: 'Demander un planning pour ma maison', href: '#contact' },
      },
      {
        q: 'Ça va tout salir chez moi et chez mes voisins.',
        a: "C'est la crainte la plus fondée de toutes : un ravalement projette. La réponse tient en trois choses concrètes — les menuiseries, les volets et les plantations sont bâchés avant le premier lavage, le sol est protégé et balayé en fin de journée, et les gravats partent avec nous, ils ne s'accumulent pas devant chez vous en attendant la fin. Le voisinage est prévenu avant l'installation de l'échafaudage, pas au moment où la benne arrive. Regardez l'état des chantiers en photo, c'est plus parlant qu'une promesse.",
        cta: { label: 'Voir l’état de nos chantiers', href: '#chantiers' },
      },
      {
        q: 'J’habite à quarante kilomètres. Vous vous déplacez vraiment ?',
        a: "L'axe Montpellier — Narbonne est notre secteur quotidien : Béziers, Sérignan, Capestang, Pézenas, Agde, Sète, Narbonne. Au-delà, la vraie question n'est pas la distance mais la durée : un ravalement de plusieurs semaines justifie un déplacement qu'une petite reprise d'une journée ne justifie pas. Dites-nous votre commune et le bâtiment, la réponse sera franche dans les deux sens — y compris si c'est non.",
        cta: { label: 'Vérifier que ma commune est desservie', href: '#zone' },
      },
    ],
  },
]

export default function Faq() {
  const sectionRef = useRef(null)
  const [famille, setFamille] = useState(FAMILLES[0].cle)
  const [ouverte, setOuverte] = useState(0)

  const active = FAMILLES.find((f) => f.cle === famille)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.faq-ligne', sectionRef.current).forEach((ligne, i) => {
        gsap.fromTo(
          ligne,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: 'power3.out',
            delay: i * 0.07,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
          },
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative px-4 md:px-12 py-[12vh]"
      aria-label="Questions fréquentes"
    >
      <div className="max-w-[1000px] mx-auto">
        <div className="overflow-hidden">
          <p className="faq-ligne font-sans uppercase tracking-[0.35em] text-xs md:text-sm text-or">
            Vos questions
          </p>
        </div>
        <div className="overflow-hidden mt-4 mb-6">
          <h2 className="faq-ligne font-serif text-white text-3xl md:text-5xl lg:text-6xl leading-[1.05]">
            Ce que vous vous demandez <span className="italic text-or">avant de signer</span>
          </h2>
        </div>
        <div className="overflow-hidden mb-12">
          <p className="faq-ligne font-sans text-white/55 text-base md:text-lg max-w-2xl leading-relaxed">
            Les vraies objections, pas celles qui arrangent. Chaque réponse mène à ce qu'il y a
            à faire ensuite.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10" role="tablist" aria-label="Familles de questions">
          {FAMILLES.map((f) => (
            <button
              key={f.cle}
              role="tab"
              aria-selected={f.cle === famille}
              onClick={() => {
                setFamille(f.cle)
                setOuverte(0)
              }}
              className={
                'font-sans uppercase tracking-[0.18em] text-xs px-6 py-3 rounded-full border transition-colors duration-500 ' +
                (f.cle === famille
                  ? 'border-or bg-or text-fond font-semibold'
                  : 'border-white/15 text-white/60 hover:border-or/50 hover:text-or')
              }
            >
              {f.titre}
            </button>
          ))}
        </div>

        <div className="border-t border-white/10">
          {active.questions.map((item, i) => {
            const estOuverte = i === ouverte
            return (
              <article key={item.q} className="border-b border-white/10">
                <h3>
                  <button
                    onClick={() => setOuverte(estOuverte ? -1 : i)}
                    aria-expanded={estOuverte}
                    className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                  >
                    <span
                      className={
                        'font-serif text-xl md:text-2xl leading-snug transition-colors duration-300 ' +
                        (estOuverte ? 'text-or' : 'text-white group-hover:text-or')
                      }
                    >
                      {item.q}
                    </span>
                    <span
                      className={
                        'shrink-0 mt-2 w-6 h-px bg-or relative transition-transform duration-500 ' +
                        (estOuverte ? 'rotate-180' : '')
                      }
                      aria-hidden="true"
                    >
                      <span
                        className={
                          'absolute inset-0 bg-or transition-transform duration-500 ' +
                          (estOuverte ? 'scale-x-0' : 'rotate-90')
                        }
                      />
                    </span>
                  </button>
                </h3>

                <div
                  className="grid transition-[grid-template-rows] duration-700 ease-out"
                  style={{ gridTemplateRows: estOuverte ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="font-sans text-white/60 text-base leading-relaxed max-w-2xl pb-6">
                      {item.a}
                    </p>
                    <a
                      href={item.cta.href}
                      target={item.cta.externe ? '_blank' : undefined}
                      rel={item.cta.externe ? 'noopener noreferrer' : undefined}
                      onClick={
                        item.cta.href.startsWith('#')
                          ? (e) => {
                              e.preventDefault()
                              scrollTo(item.cta.href)
                            }
                          : undefined
                      }
                      className="inline-flex items-center gap-2 font-sans uppercase tracking-[0.18em] text-xs text-or border-b border-or/40 pb-1 mb-8 transition-colors duration-300 hover:border-or"
                    >
                      {item.cta.label} →
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <Cta
          className="mt-14"
          label="Une question qui n’est pas là ?"
          href="#contact"
          messageWhatsapp="Bonjour, j'ai une question sur un projet de façade avant de demander un devis."
          labelWhatsapp="Demander sur WhatsApp"
        />
      </div>
    </section>
  )
}
