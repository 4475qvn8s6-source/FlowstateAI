'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLang } from './LanguageContext'
import translations from '@/app/lib/translations'

const ACCENT = '#29b6f6'

const fieldStyle = {
  base: { border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' },
  focused: { border: `1px solid ${ACCENT}66`, boxShadow: `0 0 0 3px ${ACCENT}18` },
}
function applyFocus(el: HTMLElement) { Object.assign(el.style, fieldStyle.focused) }
function applyBlur(el: HTMLElement) { Object.assign(el.style, fieldStyle.base) }

const inputClass =
  'w-full bg-white/5 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200'

const fieldVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.09, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

const INFO_ICONS = [IconMail, IconPin, IconClock]

export default function ContactSection() {
  const { lang } = useLang()
  const t = translations[lang].contact

  const [form, setForm] = useState({ name: '', email: '', businessType: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const headingRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true, amount: 0.4 })

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col justify-center py-16 md:py-24 px-5 md:px-8"
      style={{ background: '#05091a', borderTop: '1px solid rgba(26,35,126,0.4)' }}
    >
      <div className="max-w-6xl w-full mx-auto">
        {/* Section heading */}
        <div ref={headingRef} className="mb-14">
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={headingInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="text-white">{t.heading} </span>
            <span style={{ color: ACCENT }}>{t.headingAccent}</span>
          </motion.h2>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: -30 }}
            animate={headingInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-lg font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {t.pitch}
            </p>

            <div className="flex flex-col gap-5">
              {t.infoItems.map(({ label, value }, i) => {
                const Icon = INFO_ICONS[i]
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                      style={{ background: 'rgba(41,182,246,0.1)', border: '1px solid rgba(41,182,246,0.2)' }}
                    >
                      <Icon />
                    </div>
                    <div>
                      <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-0.5">{label}</p>
                      <p className="text-sm text-white/70">{value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Right column — form */}
          <div>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                  exit={{ opacity: 0, y: -16, transition: { duration: 0.35 } }}
                >
                  <motion.div custom={0} variants={fieldVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <label className="block text-xs font-semibold tracking-widest text-white/40 uppercase mb-2">{t.fields.name.label}</label>
                    <input type="text" placeholder={t.fields.name.placeholder} required value={form.name} onChange={set('name')} className={inputClass} style={fieldStyle.base} onFocus={(e) => applyFocus(e.target)} onBlur={(e) => applyBlur(e.target)} />
                  </motion.div>

                  <motion.div custom={1} variants={fieldVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <label className="block text-xs font-semibold tracking-widest text-white/40 uppercase mb-2">{t.fields.email.label}</label>
                    <input type="email" placeholder={t.fields.email.placeholder} required value={form.email} onChange={set('email')} className={inputClass} style={fieldStyle.base} onFocus={(e) => applyFocus(e.target)} onBlur={(e) => applyBlur(e.target)} />
                  </motion.div>

                  <motion.div custom={2} variants={fieldVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <label className="block text-xs font-semibold tracking-widest text-white/40 uppercase mb-2">{t.fields.businessType.label}</label>
                    <input type="text" placeholder={t.fields.businessType.placeholder} required value={form.businessType} onChange={set('businessType')} className={inputClass} style={fieldStyle.base} onFocus={(e) => applyFocus(e.target)} onBlur={(e) => applyBlur(e.target)} />
                  </motion.div>

                  <motion.div custom={3} variants={fieldVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <label className="block text-xs font-semibold tracking-widest text-white/40 uppercase mb-2">{t.fields.message.label}</label>
                    <textarea rows={4} placeholder={t.fields.message.placeholder} required value={form.message} onChange={set('message')} className={`${inputClass} resize-none`} style={fieldStyle.base} onFocus={(e) => applyFocus(e.target)} onBlur={(e) => applyBlur(e.target)} />
                  </motion.div>

                  <motion.div custom={4} variants={fieldVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-xl font-bold text-sm tracking-wide disabled:opacity-60 cursor-pointer"
                      style={{ background: ACCENT, color: '#05091a' }}
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {submitting ? t.fields.submitting : t.fields.submit}
                    </motion.button>
                  </motion.div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  className="flex items-center justify-center min-h-64"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <p className="text-2xl font-semibold" style={{ color: ACCENT }}>
                    {t.success}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
