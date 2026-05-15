'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLang } from './LanguageContext'
import translations from '@/app/lib/translations'

function smoothScroll(id: string, onDone?: () => void) {
  const el = document.getElementById(id)
  if (!el) return
  const start = window.scrollY
  const end = el.getBoundingClientRect().top + window.scrollY - 56
  const distance = end - start
  const duration = 900
  const startTime = performance.now()
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const step = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, start + distance * ease(progress))
    if (progress < 1) requestAnimationFrame(step)
    else onDone?.()
  }
  requestAnimationFrame(step)
}

const NAV_IDS = ['gsap', 'framer', 'spline', 'contact'] as const

export default function NavBar() {
  const { lang, setLang } = useLang()
  const t = translations[lang].nav
  const labels = [t.services, t.pricing, t.whyUs, t.contact]
  const [menuOpen, setMenuOpen] = useState(false)

  const closeAndScroll = (id: string) => {
    setMenuOpen(false)
    setTimeout(() => smoothScroll(id), 50)
  }

  return (
    <>
      <nav
        style={{
          height: 'var(--nav-height)',
          background: '#05091a',
          borderBottom: '1px solid rgba(26,35,126,0.4)',
        }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-8"
      >
        <Image
          src="/flowstate-logo.png"
          alt="Flowstate AI"
          height={48}
          width={160}
          style={{ height: 30, width: 'auto' }}
          priority
        />

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_IDS.map((id, i) => (
            <button
              key={id}
              onClick={() => smoothScroll(id)}
              className="text-xs font-semibold tracking-widest text-white/50 uppercase hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
            >
              {labels[i]}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Language toggle — always visible */}
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-widest">
            <button
              onClick={() => setLang('nl')}
              className="uppercase transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
              style={{ color: lang === 'nl' ? '#ffffff' : 'rgba(255,255,255,0.28)' }}
            >
              NL
            </button>
            <span style={{ color: 'rgba(255,255,255,0.18)' }}>|</span>
            <button
              onClick={() => setLang('en')}
              className="uppercase transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
              style={{ color: lang === 'en' ? '#ffffff' : 'rgba(255,255,255,0.28)' }}
            >
              EN
            </button>
          </div>

          {/* CTA — desktop only */}
          <button
            onClick={() => smoothScroll('contact')}
            className="hidden md:block px-5 py-2 rounded-full text-xs font-bold tracking-wide cursor-pointer transition-opacity duration-200 hover:opacity-85"
            style={{ background: '#29b6f6', color: '#05091a' }}
          >
            {t.cta}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex flex-col justify-center gap-[5px] w-7 h-7 cursor-pointer bg-transparent border-none p-0"
            aria-label="Menu"
          >
            <span
              className="block h-[2px] w-full rounded transition-all duration-200 origin-center"
              style={{
                background: '#ffffff',
                transform: menuOpen ? 'rotate(45deg) translate(0, 7px)' : 'none',
              }}
            />
            <span
              className="block h-[2px] w-full rounded transition-all duration-200"
              style={{
                background: '#ffffff',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-[2px] w-full rounded transition-all duration-200 origin-center"
              style={{
                background: '#ffffff',
                transform: menuOpen ? 'rotate(-45deg) translate(0, -7px)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div
          className="fixed left-0 right-0 z-40 md:hidden flex flex-col px-6 py-6 gap-5"
          style={{
            top: 'var(--nav-height)',
            background: '#05091a',
            borderBottom: '1px solid rgba(26,35,126,0.4)',
          }}
        >
          {NAV_IDS.map((id, i) => (
            <button
              key={id}
              onClick={() => closeAndScroll(id)}
              className="text-left text-sm font-semibold tracking-widest text-white/60 uppercase hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
            >
              {labels[i]}
            </button>
          ))}
          <button
            onClick={() => closeAndScroll('contact')}
            className="mt-2 w-full py-3 rounded-full text-sm font-bold tracking-wide cursor-pointer transition-opacity duration-200 hover:opacity-85"
            style={{ background: '#29b6f6', color: '#05091a' }}
          >
            {t.cta}
          </button>
        </div>
      )}
    </>
  )
}
