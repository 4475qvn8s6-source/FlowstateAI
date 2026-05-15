'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from './LanguageContext'
import translations from '@/app/lib/translations'

const ACCENT = '#29b6f6'

export default function SplineSection() {
  const { lang } = useLang()
  const t = translations[lang].whyUs

  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reasonsRef = useRef<HTMLDivElement>(null)

  const headingInView = useInView(headingRef, { once: true, amount: 0.5 })
  const reasonsInView = useInView(reasonsRef, { once: true, amount: 0.3 })

  return (
    <section
      ref={sectionRef}
      id="spline"
      className="relative flex flex-col items-center px-8 py-20"
      style={{ background: '#05091a', borderTop: '1px solid rgba(26,35,126,0.4)' }}
    >
      <motion.h2
        ref={headingRef}
        className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white text-center mb-10"
        initial={{ opacity: 0, y: 40 }}
        animate={headingInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {t.heading}
      </motion.h2>

      <div ref={reasonsRef} className="flex flex-col md:flex-row gap-6 max-w-5xl w-full">
        {t.reasons.map(({ title, description, support }, i) => (
          <motion.div
            key={i}
            className="flex-1 flex flex-col rounded-2xl overflow-hidden"
            style={{ background: '#0a0f2e', border: '1px solid #1a237e' }}
            initial={{ opacity: 0, y: 50 }}
            animate={reasonsInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.65, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Top accent */}
            <div className="w-full h-[3px]" style={{ background: ACCENT }} />

            <div className="flex flex-col gap-3 p-8">
              <span className="text-4xl font-semibold tracking-tight leading-none" style={{ color: ACCENT }}>
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Divider */}
              <div className="w-8 h-px mt-1" style={{ background: 'rgba(41,182,246,0.35)' }} />

              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">{description}</p>
              <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(41,182,246,0.7)' }}>{support}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
