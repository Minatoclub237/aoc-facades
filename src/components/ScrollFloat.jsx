import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollFloat.css'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollFloat({ children }) {
  const containerRef = useRef(null)

  const lines = useMemo(() => {
    const text = typeof children === 'string' ? children : ''
    return text.split('\n').map((line) => line.split(' '))
  }, [children])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chars = container.querySelectorAll('.char')
    const tween = gsap.fromTo(
      chars,
      { opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1, transformOrigin: '50% 0%' },
      {
        opacity: 0,
        yPercent: 250,
        scaleY: 1.2,
        scaleX: 0.9,
        stagger: 0.05,
        ease: 'power2.inOut',
        duration: 1,
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=1000',
          scrub: 1.5,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [lines])

  return (
    <div className="fixed inset-0 z-10 flex flex-col justify-end p-4 md:p-8 pointer-events-none">
      <h1
        ref={containerRef}
        className="scroll-float-text font-dirtyline text-white"
        style={{
          fontSize: 'clamp(4rem, 15vw, 317px)',
          lineHeight: 0.85,
          letterSpacing: '0%',
        }}
      >
        {lines.map((words, lineIndex) => (
          <span key={lineIndex} style={{ display: 'block' }}>
            {words.map((word, wordIndex) => (
              <span key={wordIndex}>
                <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                  {word.split('').map((char, charIndex) => (
                    <span className="char" key={charIndex}>
                      {char}
                    </span>
                  ))}
                </span>
                {wordIndex < words.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </span>
        ))}
      </h1>
    </div>
  )
}
