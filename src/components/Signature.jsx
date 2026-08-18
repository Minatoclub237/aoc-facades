import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Respiration entre le hero et le contenu : deux bandes Dirtyline qui se croisent
 * en sens inverse, et la signature révélée par un balayage or.
 */
export default function Signature() {
  const sectionRef = useRef(null)
  const bandTopRef = useRef(null)
  const bandBottomRef = useRef(null)
  const wipeRef = useRef(null)
  const ruleRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrub = {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      }

      gsap.fromTo(bandTopRef.current, { xPercent: 6 }, { xPercent: -18, ease: 'none', scrollTrigger: scrub })
      gsap.fromTo(bandBottomRef.current, { xPercent: -18, ease: 'none' }, { xPercent: 6, ease: 'none', scrollTrigger: scrub })

      gsap.fromTo(
        wipeRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            end: 'center 55%',
            scrub: 1,
          },
        },
      )

      gsap.fromTo(
        ruleRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'center 60%', scrub: 1 },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-[18vh] flex flex-col justify-center gap-6 md:gap-10"
      aria-label="Notre signature"
    >
      <div
        ref={bandTopRef}
        className="font-dirtyline whitespace-nowrap leading-none text-white/12 select-none"
        style={{ fontSize: 'clamp(5rem, 17vw, 300px)' }}
        aria-hidden="true"
      >
        EXIGENCE EXIGENCE EXIGENCE
      </div>

      <div className="px-6 md:px-12 text-center">
        <span
          ref={ruleRef}
          className="block h-px w-24 md:w-40 mx-auto mb-8 bg-or origin-left"
          aria-hidden="true"
        />
        <p
          ref={wipeRef}
          className="font-serif italic text-or text-3xl md:text-5xl lg:text-6xl leading-tight"
        >
          Notre exigence, votre satisfaction.
        </p>
      </div>

      <div
        ref={bandBottomRef}
        className="font-dirtyline whitespace-nowrap leading-none text-white/12 select-none text-right"
        style={{ fontSize: 'clamp(5rem, 17vw, 300px)' }}
        aria-hidden="true"
      >
        SATISFACTION SATISFACTION
      </div>
    </section>
  )
}
