/**
 * Fin de parcours : plus aucun mouvement, le regard doit se poser sur le numéro.
 */
export default function Contact() {
  return (
    <footer id="contact" className="relative px-6 md:px-12 pt-[12vh] pb-12" aria-label="Contact">
      <div className="max-w-[1250px] mx-auto">
        <p className="font-sans uppercase tracking-[0.35em] text-xs md:text-sm text-or mb-6">
          Contact
        </p>
        <h2 className="font-serif text-white text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-10 max-w-3xl">
          Une étude personnalisée et un <span className="italic text-or">devis gratuit</span>.
        </h2>

        <a
          href="tel:+33666471389"
          className="font-serif text-or block leading-none mb-12 tracking-tight transition-opacity duration-300 hover:opacity-70"
          style={{ fontSize: 'clamp(2.75rem, 9vw, 150px)' }}
        >
          06 66 47 13 89
        </a>

        <div className="grid gap-8 md:grid-cols-3 border-t border-white/10 pt-10 font-sans text-sm">
          <div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-xs mb-3">Atelier</p>
            <p className="text-white/75 leading-relaxed">
              5 placette des Rosiers
              <br />
              34490 Lignan-sur-Orb
              <br />
              Hérault
            </p>
          </div>
          <div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-xs mb-3">Interventions</p>
            <p className="text-white/75 leading-relaxed">
              De Montpellier à Narbonne
              <br />
              Hérault et Aude
            </p>
          </div>
          <div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-xs mb-3">Société</p>
            <p className="text-white/75 leading-relaxed">
              AOC Façades
              <br />
              Société à responsabilité limitée
              <br />
              Maçonnerie et rénovation
            </p>
          </div>
        </div>

        <p className="font-serif italic text-white/35 text-lg mt-12">
          Notre exigence, votre satisfaction.
        </p>
      </div>
    </footer>
  )
}
