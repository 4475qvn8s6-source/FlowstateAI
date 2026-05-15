'use client'

import { useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLang } from './LanguageContext'
import translations from '@/app/lib/translations'

const ACCENT = '#29b6f6'

const ICONS = {
  Lightning: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Layers: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Diamond: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M11 3L7 9h10l-4-6" />
      <line x1="2" y1="9" x2="22" y2="9" />
    </svg>
  ),
  Wrench: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
}

const CARD_ICONS = [ICONS.Lightning, ICONS.Layers, ICONS.Diamond, ICONS.Wrench]
const IS_POPULAR = [false, true, false, false]

export default function FramerSection() {
  const { lang } = useLang()
  const t = translations[lang].pricing

  const headingRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const headingInView = useInView(headingRef, { once: true, amount: 0.5 })
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.2 })

  return (
    <section
      id="framer"
      className="relative"
      style={{ borderTop: '1px solid rgba(26,35,126,0.4)', background: '#0a0f2e' }}
    >
      {/* Static left decorative bar */}
      <div className="absolute left-6 top-0 bottom-0 w-[2px]" style={{ background: 'rgba(26,35,126,0.5)' }} />

      <div className="flex flex-col items-center justify-center gap-8 px-4 md:px-16 pt-14 md:pt-20 pb-14 md:pb-24">
        <motion.h2
          ref={headingRef}
          className="text-3xl sm:text-5xl md:text-7xl font-semibold tracking-tight text-white flex-shrink-0 text-center"
          initial={{ x: -80, opacity: 0 }}
          animate={headingInView ? { x: 0, opacity: 1 } : undefined}
          transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {t.heading}
        </motion.h2>

        {/* Cards + add-ons strip container */}
        <div ref={cardsRef} className="flex flex-col gap-4 w-full md:max-w-[888px]">
          {/* 4-card row: stacked on mobile, single row on desktop */}
          <div className="flex flex-col sm:flex-row gap-4">
            <AnimatePresence>
              {cardsInView &&
                t.cards.map((card, i) => {
                  const { title, text, features } = card
                  const badge = 'badge' in card ? (card as typeof card & { badge: string }).badge : undefined
                  const Icon = CARD_ICONS[i]
                  const isPopular = IS_POPULAR[i]
                  return (
                    <motion.div
                      key={i}
                      className="flex flex-col rounded-2xl overflow-hidden cursor-default select-none flex-1"
                      style={{
                        border: isPopular ? `1px solid ${ACCENT}` : '1px solid #1a237e',
                        background: isPopular ? 'rgba(41,182,246,0.06)' : 'rgba(26,35,126,0.15)',
                        position: 'relative',
                      }}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 30, opacity: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                      whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 280, damping: 18 } }}
                    >
                      {/* Top border accent */}
                      <div className="w-full h-[3px]" style={{ background: isPopular ? ACCENT : '#1a237e' }} />

                      {/* Badge */}
                      {isPopular && badge && (
                        <div className="absolute top-3 right-3">
                          <span
                            className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase"
                            style={{ background: ACCENT, color: '#05091a' }}
                          >
                            {badge}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col gap-2.5 p-5 flex-1">
                        <Icon />
                        <span className="text-white font-bold text-sm leading-snug">{title}</span>
                        <span className="text-white/40 text-xs leading-relaxed">{text}</span>

                        <ul className="flex flex-col gap-1 mt-0.5">
                          {features.map((f, fi) => (
                            <li key={fi} className="flex items-start gap-2 text-xs text-white/50">
                              <span style={{ color: ACCENT }} className="mt-0.5 leading-none flex-shrink-0">&#x2713;</span>
                              {f}
                            </li>
                          ))}
                        </ul>

                        <button
                          className="mt-auto pt-3 self-start text-xs font-semibold tracking-wide px-4 py-2 rounded-lg transition-colors duration-200"
                          style={{ color: ACCENT, border: `1px solid ${ACCENT}44`, background: `${ACCENT}11` }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = `${ACCENT}22` }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = `${ACCENT}11` }}
                        >
                          {t.getStarted}
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
            </AnimatePresence>
          </div>

          {/* Add-ons strip */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 px-4 sm:px-5 py-4 rounded-2xl overflow-hidden"
            style={{
              border: '1px solid #1a237e',
              background: 'rgba(26,35,126,0.12)',
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={cardsInView ? { y: 0, opacity: 1 } : undefined}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Left: icon + title */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <ICONS.Plus />
              <span className="text-white font-bold text-sm whitespace-nowrap">{t.addons.title}</span>
            </div>

            {/* Vertical divider — desktop only */}
            <div className="hidden sm:block w-px self-stretch" style={{ background: 'rgba(255,255,255,0.08)' }} />

            {/* Pills */}
            <div className="flex flex-wrap gap-2 flex-1">
              {t.addons.items.map((addon, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={{
                    background: 'rgba(41,182,246,0.07)',
                    border: '1px solid rgba(41,182,246,0.18)',
                    color: 'rgba(255,255,255,0.55)',
                  }}
                >
                  {addon}
                </span>
              ))}
            </div>

            {/* CTA */}
            <button
              className="self-start sm:flex-shrink-0 text-xs font-semibold tracking-wide px-4 py-2 rounded-lg transition-colors duration-200"
              style={{ color: ACCENT, border: `1px solid ${ACCENT}44`, background: `${ACCENT}11` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${ACCENT}22` }}
              onMouseLeave={(e) => { e.currentTarget.style.background = `${ACCENT}11` }}
            >
              {t.getStarted}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
