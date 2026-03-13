import React, { createContext, useContext, useState, useCallback } from 'react';
import { Language, t, td } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
  td: (value: string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  }, []);

  const translate = useCallback((key: string) => t(key, lang), [lang]);
  const translateDynamic = useCallback((value: string | null | undefined) => td(value, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t: translate, td: translateDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
