'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useLang } from './LanguageContext'
import translations from '@/app/lib/translations'

const WAVE_1 =
  'M 0 0 L 0 900 L 1400 900 Q 1440 760 1370 620 Q 1300 480 1420 340 Q 1440 260 1380 140 Q 1340 60 1400 0 Z'
const WAVE_2 =
  'M 0 0 L 0 900 L 1300 900 Q 1390 740 1300 580 Q 1210 420 1360 270 Q 1440 170 1310 60 Q 1270 20 1300 0 Z'
const FOAM_1 =
  'M 1300 900 Q 1390 740 1300 580 Q 1210 420 1360 270 Q 1440 170 1310 60 Q 1270 20 1300 0'
const FOAM_2 =
  'M 1370 900 Q 1440 730 1360 570 Q 1280 400 1430 250 Q 1440 200 1400 100 Q 1380 40 1370 0'

function smoothScroll(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const start = window.scrollY
  const end = el.getBoundingClientRect().top + window.scrollY - 56
  const distance = end - start
  const duration = 1200
  const startTime = performance.now()
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const step = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, start + distance * ease(progress))
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export default function HeroSection() {
  const { lang } = useLang()
  const t = translations[lang].hero

  // ── Wave entrance animation ──────────────────────────────────────────────
  const waveControls = useAnimation()
  const textControls = useAnimation()
  const subtitleControls = useAnimation()
  const buttonsControls = useAnimation()
  const played = useRef(false)

  useEffect(() => {
    if (played.current) return
    played.current = true

    async function play() {
      waveControls.set({ x: '-100%' })
      textControls.set({ opacity: 0, y: 40 })
      subtitleControls.set({ opacity: 0, y: 20 })
      buttonsControls.set({ opacity: 0, y: 16 })

      await waveControls.start({ x: '0%', transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } })
      await new Promise<void>((r) => setTimeout(r, 400))

      waveControls.start({ x: '100%', transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } })

      await new Promise<void>((r) => setTimeout(r, 50))
      textControls.start({ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } })

      await new Promise<void>((r) => setTimeout(r, 250))
      subtitleControls.start({ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } })

      await new Promise<void>((r) => setTimeout(r, 200))
      buttonsControls.start({ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } })
    }

    play()
  }, [waveControls, textControls, subtitleControls, buttonsControls])

  // ── Typewriter ───────────────────────────────────────────────────────────
  // All mutable state lives in a ref so the timer loop never stales out.
  // Only `displayedText` (a plain string) triggers React re-renders.
  const [displayedText, setDisplayedText] = useState('')
  const tw = useRef({ lineIndex: 0, charIndex: 0, deleting: false, timer: 0 })

  useEffect(() => {
    const state = tw.current
    state.lineIndex = 0
    state.charIndex = 0
    state.deleting = false
    clearTimeout(state.timer)

    const lines = t.subtitles

    function tick() {
      const line = lines[state.lineIndex]

      if (!state.deleting) {
        if (state.charIndex < line.length) {
          state.charIndex++
          setDisplayedText(line.slice(0, state.charIndex))
          state.timer = window.setTimeout(tick, 50)
        } else {
          // fully typed — pause then start deleting
          state.timer = window.setTimeout(() => {
            state.deleting = true
            tick()
          }, 2000)
        }
      } else {
        if (state.charIndex > 0) {
          state.charIndex--
          setDisplayedText(line.slice(0, state.charIndex))
          state.timer = window.setTimeout(tick, 30)
        } else {
          // fully erased — advance line
          state.deleting = false
          state.lineIndex = (state.lineIndex + 1) % lines.length
          state.timer = window.setTimeout(tick, 50)
        }
      }
    }

    state.timer = window.setTimeout(tick, 50)
    return () => clearTimeout(state.timer)
  // Re-run only when the language (and therefore the lines array) changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  return (
    <section
      id="hero"
      className="relative overflow-hidden flex items-center justify-center"
      style={{ background: '#05091a', minHeight: 'calc(100vh - var(--nav-height))' }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 55%, rgba(41,182,246,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Ambient floating orbs */}
      {[
        { top: '18%', left: '12%', size: 220, delay: 0 },
        { top: '65%', right: '10%', size: 160, delay: 1.4 },
        { top: '42%', left: '70%', size: 100, delay: 0.8 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: orb.top,
            left: (orb as { left?: string }).left,
            right: (orb as { right?: string }).right,
            width: orb.size,
            height: orb.size,
            background: 'radial-gradient(circle, rgba(41,182,246,0.07) 0%, transparent 70%)',
            filter: 'blur(24px)',
          }}
          animate={{ y: [0, -18, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5 + i * 1.2, delay: orb.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Wave overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        animate={waveControls}
        initial={{ x: '-100%' }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d={WAVE_1} fill="#1a237e" />
        </svg>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d={WAVE_2} fill="#29b6f6" fillOpacity="0.85" />
          <path d={FOAM_1} stroke="#ffffff" strokeWidth="2.5" fill="none" strokeOpacity="0.7" />
          <path d={FOAM_2} stroke="#ffffff" strokeWidth="1.5" fill="none" strokeOpacity="0.4" />
        </svg>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
        animate={buttonsControls}
        initial={{ opacity: 0 }}
      >
        <span className="text-[10px] tracking-widest text-white/25 uppercase">{t.scroll}</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#29b6f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Centered text + CTAs */}
      <div className="relative z-0 flex flex-col items-center gap-4 text-center px-8 pt-8 pb-24">
        <motion.h1
          className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-none"
          animate={textControls}
          initial={{ opacity: 0, y: 40 }}
        >
          <span className="text-white">Flowstate</span>
          <span style={{ color: '#29b6f6' }}> AI</span>
        </motion.h1>

        {/* Typewriter subtitle */}
        <motion.p
          className="text-base sm:text-xl font-light max-w-lg min-h-[1.6em]"
          style={{ color: 'rgba(255,255,255,0.65)' }}
          animate={subtitleControls}
          initial={{ opacity: 0, y: 20 }}
        >
          {displayedText}
          <motion.span
            aria-hidden
            style={{ color: '#29b6f6', marginLeft: 1 }}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
          >
            |
          </motion.span>
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center items-center gap-3 mt-4"
          animate={buttonsControls}
          initial={{ opacity: 0, y: 16 }}
        >
          <button
            onClick={() => smoothScroll('contact')}
            className="px-7 py-3 rounded-full text-sm font-bold tracking-wide cursor-pointer transition-opacity duration-200 hover:opacity-85"
            style={{ background: '#29b6f6', color: '#05091a' }}
          >
            {t.primaryCta}
          </button>
          <button
            onClick={() => smoothScroll('gsap')}
            className="px-7 py-3 rounded-full text-sm font-semibold tracking-wide cursor-pointer transition-all duration-200"
            style={{
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'rgba(255,255,255,0.8)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#29b6f6'; e.currentTarget.style.color = '#29b6f6' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
          >
            {t.secondaryCta}
          </button>
        </motion.div>
      </div>
    </section>
  )
}
