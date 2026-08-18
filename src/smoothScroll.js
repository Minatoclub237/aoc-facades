import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

/**
 * Une seule instance de Lenis pour toute la page, pilotée par le ticker GSAP
 * pour que le scrub des sections et le lissage partagent la même horloge.
 * Le mouvement est volontairement long (lerp bas) : c'est ce qui donne la
 * sensation de glisse plutôt que de saut.
 */
export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9, autoRaf: false })
  lenis.on('scroll', ScrollTrigger.update)

  const raf = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(raf)
    lenis.destroy()
    lenis = null
  }
}

/** Cible acceptée : nombre, sélecteur CSS ou élément. */
export function scrollTo(cible, duree = 2.4) {
  if (lenis) {
    lenis.scrollTo(cible, { duration: duree })
    return
  }
  const y =
    typeof cible === 'number' ? cible : document.querySelector(cible)?.offsetTop ?? 0
  window.scrollTo({ top: y, behavior: 'smooth' })
}
