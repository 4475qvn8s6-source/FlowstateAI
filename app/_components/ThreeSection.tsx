'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useLang } from './LanguageContext'
import translations from '@/app/lib/translations'

const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false })

export default function ThreeSection() {
  const { lang } = useLang()
  const t = translations[lang].threeCta

  return (
    <section
      id="threejs"
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#05091a', borderTop: '1px solid rgba(26,35,126,0.4)' }}
    >
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm tracking-widest uppercase">
            Loading 3D…
          </div>
        }
      >
        <ThreeScene t={t} />
      </Suspense>
    </section>
  )
}
