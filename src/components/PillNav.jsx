import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import './PillNav.css'

gsap.registerPlugin(ScrollToPlugin)

const LOGO_PATHS = [
  'm50,50c0,18.2,14.77,32.98,32.97,32.98,0-18.2-14.77-32.98-32.97-32.98Z',
  'm17.02,82.98c18.2,0,32.98-14.77,32.98-32.98-18.2,0-32.98,14.77-32.98,32.98Z',
  'm82.98,17.02c-18.2,0-32.97,14.77-32.97,32.97,18.2,0,32.97-14.77,32.97-32.97Z',
  'm17.02,17.02c0,18.2,14.77,32.97,32.98,32.97,0-18.2-14.77-32.97-32.98-32.97Z',
]

const scrollTo = (target) =>
  gsap.to(window, { duration: 3, scrollTo: target, ease: 'power3.inOut' })

const NAV_ITEMS = [
  { label: 'Accueil', onClick: () => scrollTo(0) },
  { label: 'À propos', onClick: () => scrollTo(document.body.scrollHeight) },
  { label: 'Services', onClick: () => scrollTo(document.body.scrollHeight * 0.6) },
  { label: 'Contact', onClick: () => scrollTo(document.body.scrollHeight) },
]

export default function PillNav() {
  const logoRef = useRef(null)
  const logoSvgRef = useRef(null)
  const navItemsRef = useRef(null)
  const pillRefs = useRef([])
  const timelinesRef = useRef([])
  const popoverRef = useRef(null)
  const lineTopRef = useRef(null)
  const lineBottomRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // Animation d'apparition
  useEffect(() => {
    gsap.fromTo(logoRef.current, { scale: 0 }, { scale: 1, duration: 0.6, ease: 'power3.out' })
    gsap.fromTo(
      navItemsRef.current,
      { width: 0 },
      { width: 'auto', duration: 0.6, ease: 'power3.out' },
    )
  }, [])

  // Construction des timelines de survol (remplissage liquide)
  useEffect(() => {
    const build = () => {
      timelinesRef.current.forEach((tl) => tl?.kill())
      timelinesRef.current = pillRefs.current.map((pill) => {
        if (!pill) return null

        const circle = pill.querySelector('.hover-circle')
        const label = pill.querySelector('.pill-label')
        const labelHover = pill.querySelector('.pill-label-hover')
        const { width: w, height: h } = pill.getBoundingClientRect()
        if (!circle || !w || !h) return null

        const R = (w * w / 4 + h * h) / (2 * h)
        const D = 2 * R + 2
        const delta = R - Math.sqrt(R * R - (w * w) / 4) + 1

        gsap.set(circle, {
          width: D,
          height: D,
          bottom: -delta,
          left: '50%',
          xPercent: -50,
          transformOrigin: `50% ${D - delta}px`,
          scale: 0,
        })
        gsap.set(label, { y: 0 })
        gsap.set(labelHover, { y: '100%' })

        const tl = gsap.timeline({ paused: true })
        tl.to(circle, { scale: 3, ease: 'power3.out', duration: 0.5 }, 0)
          .to(label, { y: '-100%', ease: 'power3.out', duration: 0.5 }, 0)
          .to(labelHover, { y: 0, ease: 'power3.out', duration: 0.5 }, 0)
        return tl
      })
    }

    // On mesure après l'animation d'ouverture (le conteneur part d'une largeur nulle)
    // et une fois les polices chargées, sinon les pastilles mesurent 0.
    const delayed = gsap.delayedCall(0.7, build)
    document.fonts?.ready.then(build)
    window.addEventListener('resize', build)
    return () => {
      delayed.kill()
      window.removeEventListener('resize', build)
      timelinesRef.current.forEach((tl) => tl?.kill())
    }
  }, [])

  // Menu mobile : hamburger -> croix + popover
  useEffect(() => {
    const popover = popoverRef.current
    if (!popover) return

    gsap.to(lineTopRef.current, {
      rotation: menuOpen ? 45 : 0,
      y: menuOpen ? 3 : 0,
      duration: 0.3,
      ease: 'power3.out',
    })
    gsap.to(lineBottomRef.current, {
      rotation: menuOpen ? -45 : 0,
      y: menuOpen ? -3 : 0,
      duration: 0.3,
      ease: 'power3.out',
    })

    if (menuOpen) {
      gsap.set(popover, { visibility: 'visible', xPercent: -50 })
      gsap.fromTo(
        popover,
        { opacity: 0, y: -10, xPercent: -50 },
        { opacity: 1, y: 0, xPercent: -50, duration: 0.3, ease: 'power3.out' },
      )
    } else {
      gsap.to(popover, {
        opacity: 0,
        y: -10,
        xPercent: -50,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => gsap.set(popover, { visibility: 'hidden' }),
      })
    }
  }, [menuOpen])

  const handleLogoEnter = () =>
    gsap.to(logoSvgRef.current, { rotation: 360, duration: 0.2, ease: 'power2.out' })
  const handleLogoLeave = () => gsap.set(logoSvgRef.current, { rotation: 0 })

  return (
    <nav className="pill-nav-container" aria-label="Navigation principale">
      <div className="pill-nav">
        <button
          ref={logoRef}
          className="pill-logo"
          aria-label="AOC Façades — retour en haut"
          onMouseEnter={handleLogoEnter}
          onMouseLeave={handleLogoLeave}
          onClick={() => scrollTo(0)}
        >
          <span className="logo-svg-container" ref={logoSvgRef}>
            <svg width="24" height="24" viewBox="0 0 100 100" aria-hidden="true">
              {LOGO_PATHS.map((d, i) => (
                <path key={i} d={d} fill="#fff" />
              ))}
            </svg>
          </span>
        </button>

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.label}>
                <button
                  className="pill"
                  ref={(el) => (pillRefs.current[i] = el)}
                  onMouseEnter={() => timelinesRef.current[i]?.tweenTo(timelinesRef.current[i].duration(), { duration: 0.3 })}
                  onMouseLeave={() => timelinesRef.current[i]?.tweenTo(0, { duration: 0.2 })}
                  onClick={item.onClick}
                >
                  <span className="hover-circle" aria-hidden="true" />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover" aria-hidden="true">
                      {item.label}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="mobile-menu-button mobile-only"
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="hamburger-line" ref={lineTopRef} />
          <span className="hamburger-line" ref={lineBottomRef} />
        </button>
      </div>

      <div className="mobile-menu-popover mobile-only" ref={popoverRef}>
        <ul className="mobile-menu-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                className="mobile-menu-link"
                onClick={() => {
                  setMenuOpen(false)
                  item.onClick()
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
