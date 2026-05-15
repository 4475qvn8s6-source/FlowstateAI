'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Lang } from '@/app/lib/translations'

type LanguageContextType = {
  lang: Lang
  setLang: (l: Lang) => void
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'nl',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('nl')
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
