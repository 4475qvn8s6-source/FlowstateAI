'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from './LanguageContext'
import translations from '@/app/lib/translations'

gsap.registerPlugin(ScrollTrigger)

export default function GsapSection() {
  const { lang } = useLang()
  const t = translations[lang].stats

  const sectionRef = useRef<HTMLElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(progressBarRef.current, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top+=56',
          end: 'bottom bottom',
          scrub: true,
        },
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top+=56',
          end: '+=700',
          scrub: 1,
        },
      })

      tl.from('.gsap-word', {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.5,
        ease: 'power3.out',
      }).from(
        '.gsap-card',
        { y: 60, opacity: 0, stagger: 0.15, duration: 0.45, ease: 'power3.out' },
        '+=0.1'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="gsap"
      className="relative min-h-[250vh]"
      style={{ borderTop: '1px solid rgba(26,35,126,0.4)' }}
    >
      <div
        className="sticky flex flex-col overflow-hidden"
        style={{ top: 'var(--nav-height)', height: 'calc(100vh - var(--nav-height))', background: '#05091a' }}
      >
        {/* Progress bar */}
        <div className="h-[2px] flex-none" style={{ background: 'rgba(26,35,126,0.4)' }}>
          <div ref={progressBarRef} className="h-full w-0" style={{ backgroundColor: '#29b6f6' }} />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 md:gap-10 px-4 md:px-6">
          <h2 className="flex flex-wrap justify-center gap-x-4 text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight text-white leading-none">
            {t.words.map((word, i) => (
              <span key={i} className="gsap-word inline-block">{word}</span>
            ))}
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {t.items.map(({ value, label, sub }, i) => (
              <div
                key={i}
                className="gsap-card flex flex-col items-center justify-start w-40 sm:w-56 rounded-2xl overflow-hidden"
                style={{ border: '1px solid #1a237e', background: 'rgba(26,35,126,0.12)' }}
              >
                {/* Cyan top accent line */}
                <div className="w-full h-[3px]" style={{ background: '#29b6f6' }} />
                <div className="flex flex-col items-center justify-center px-6 py-8 gap-1 flex-1">
                  <span className="text-4xl font-semibold tracking-tight" style={{ color: '#29b6f6' }}>
                    {value}
                  </span>
                  <span className="mt-2 text-xs uppercase tracking-widest text-white/50 text-center">
                    {label}
                  </span>
                  <span className="mt-1 text-xs text-white/30 text-center font-light leading-snug">
                    {sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
