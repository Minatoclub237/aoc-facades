import { scrollTo } from '../smoothScroll'

const TELEPHONE = '06 66 47 13 89'
// À REMPLACER : adresse non fournie par le client.
const EMAIL = 'contact@aoc-facades.fr'

const NAVIGATION = [
  { label: 'Accueil', cible: 0 },
  { label: 'Nos activités', cible: '#metiers' },
  { label: 'Avant / après', cible: '#travaux' },
  { label: 'Nos chantiers', cible: '#chantiers' },
  { label: "Zone d'intervention", cible: '#zone' },
  { label: 'Contact', cible: '#contact' },
]

const PRESTATIONS = [
  'Restauration de façades',
  'Application d’enduits',
  'Peinture extérieure',
  'Nettoyage et traitement',
  'Finitions soignées',
  'Isolation thermique par l’extérieur',
  'Plaques, plâtre et enduits intérieurs',
]

const COMMUNES =
  'Béziers · Sérignan · Capestang · Valras-Plage · Pézenas · Agde · Narbonne · Sète · Montpellier'

export default function Footer() {
  const annee = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/10 px-6 md:px-12 pt-16 pb-10">
      <div className="max-w-[1250px] mx-auto">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr]">
          <div>
            <img
              src="/logo-aoc.png"
              alt="AOC Façades — rénovation extérieure"
              width="690"
              height="650"
              loading="lazy"
              className="w-[190px] h-auto mb-6"
            />
            <p className="font-serif italic text-white/45 text-lg mb-6">
              Notre exigence, votre satisfaction.
            </p>
            <p className="font-sans text-white/50 text-sm leading-relaxed max-w-xs">
              Ravalement, isolation et enduits, de Montpellier à Narbonne. Près de 30 ans de
              savoir-faire au service de vos façades.
            </p>
          </div>

          <nav aria-label="Pied de page">
            <h2 className="font-sans uppercase tracking-[0.2em] text-[11px] text-or mb-5">
              Navigation
            </h2>
            <ul className="space-y-3">
              {NAVIGATION.map((lien) => (
                <li key={lien.label}>
                  <button
                    onClick={() => scrollTo(lien.cible)}
                    className="font-sans text-white/60 text-sm text-left transition-colors duration-300 hover:text-or"
                  >
                    {lien.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-sans uppercase tracking-[0.2em] text-[11px] text-or mb-5">
              Prestations
            </h2>
            <ul className="space-y-3">
              {PRESTATIONS.map((prestation) => (
                <li key={prestation} className="font-sans text-white/60 text-sm leading-snug">
                  {prestation}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-sans uppercase tracking-[0.2em] text-[11px] text-or mb-5">
              Contact
            </h2>
            <address className="not-italic font-sans text-white/60 text-sm space-y-4">
              <p className="leading-relaxed">
                5 placette des Rosiers
                <br />
                34490 Lignan-sur-Orb
                <br />
                Hérault, Occitanie
              </p>
              <p>
                <a
                  href={'tel:+33' + TELEPHONE.replace(/\s/g, '').slice(1)}
                  className="text-or text-lg font-semibold tracking-wide transition-opacity duration-300 hover:opacity-70"
                >
                  {TELEPHONE}
                </a>
              </p>
              <p>
                <a
                  href={'mailto:' + EMAIL}
                  className="transition-colors duration-300 hover:text-or break-all"
                >
                  {EMAIL}
                </a>
              </p>
            </address>

            <h2 className="font-sans uppercase tracking-[0.2em] text-[11px] text-or mt-8 mb-3">
              Horaires
            </h2>
            <p className="font-sans text-white/40 text-sm italic">
              Du lundi au vendredi — à compléter
            </p>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10">
          <h2 className="font-sans uppercase tracking-[0.2em] text-[11px] text-or mb-3">
            Nous intervenons à
          </h2>
          <p className="font-sans text-white/40 text-sm leading-relaxed">{COMMUNES}</p>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-x-8 gap-y-3 justify-between font-sans text-white/35 text-xs">
          <p>
            © {annee} AOC Façades — société à responsabilité limitée, maçonnerie et rénovation.
          </p>
          <p>Siège social : 5 placette des Rosiers, 34490 Lignan-sur-Orb.</p>
        </div>
      </div>
    </footer>
  )
}
