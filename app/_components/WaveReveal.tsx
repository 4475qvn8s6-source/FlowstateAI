'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

const WAVE_1 =
  'M 0 0 L 0 900 L 1400 900 Q 1440 760 1370 620 Q 1300 480 1420 340 Q 1440 260 1380 140 Q 1340 60 1400 0 Z'

const WAVE_2 =
  'M 0 0 L 0 900 L 1300 900 Q 1390 740 1300 580 Q 1210 420 1360 270 Q 1440 170 1310 60 Q 1270 20 1300 0 Z'

const FOAM_1 =
  'M 1300 900 Q 1390 740 1300 580 Q 1210 420 1360 270 Q 1440 170 1310 60 Q 1270 20 1300 0'

const FOAM_2 =
  'M 1370 900 Q 1440 730 1360 570 Q 1280 400 1430 250 Q 1440 200 1400 100 Q 1380 40 1370 0'

export default function WaveReveal() {
  const sectionRef = useRef<HTMLElement>(null)
  const waveControls = useAnimation()
  const textControls = useAnimation()
  const subtitleControls = useAnimation()

  const inView = useInView(sectionRef, { once: false, amount: 0.5 })

  useEffect(() => {
    if (!inView) return

    async function play() {
      waveControls.set({ x: '-100%' })
      textControls.set({ opacity: 0, y: 40 })
      subtitleControls.set({ opacity: 0, y: 20 })

      // Wave floods in (1.2s)
      await waveControls.start({
        x: '0%',
        transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
      })

      // Hold (0.4s)
      await new Promise<void>((r) => setTimeout(r, 400))

      // Wave recedes (0.5s) — don't await so text can start while wave exits
      waveControls.start({
        x: '100%',
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      })

      // Minimal delay so text starts almost immediately as wave retreats
      await new Promise<void>((r) => setTimeout(r, 50))
      textControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
      })

      // Subtitle with 0.3s delay
      await new Promise<void>((r) => setTimeout(r, 300))
      subtitleControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
      })
    }

    play()
  }, [inView, waveControls, textControls, subtitleControls])

  return (
    <section
      ref={sectionRef}
      id="wave"
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: '#0a1628', borderTop: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Wave overlay — translates across the viewport */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        animate={waveControls}
        initial={{ x: '-100%' }}
      >
        {/* Back wave layer — lighter blue */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={WAVE_1} fill="#1a4a8a" />
        </svg>

        {/* Front wave layer — deep blue with foam strokes */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={WAVE_2} fill="#0d2a5c" />
          <path d={FOAM_1} stroke="#e8f4fd" strokeWidth="2.5" fill="none" strokeOpacity="0.55" />
          <path d={FOAM_2} stroke="#e8f4fd" strokeWidth="1.5" fill="none" strokeOpacity="0.3" />
        </svg>
      </motion.div>

      {/* Centered text — sits behind the wave, revealed as it recedes */}
      <div className="relative z-0 flex flex-col items-center gap-5 text-center px-8">
        <motion.h2
          className="text-8xl font-semibold tracking-tight text-white"
          animate={textControls}
          initial={{ opacity: 0, y: 40 }}
        >
          The ocean called.
        </motion.h2>
        <motion.p
          className="text-xl text-white/50 font-light"
          animate={subtitleControls}
          initial={{ opacity: 0, y: 20 }}
        >
          And we answered.
        </motion.p>
      </div>
    </section>
  )
}
