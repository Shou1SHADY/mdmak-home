"use client";

import { useState, useEffect } from 'react';

type Language = 'ar' | 'en';

export function useLanguage() {
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    const savedLang = localStorage.getItem('mdmak_lang') as Language;
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('mdmak_lang', newLang);
  };

  const isRtl = lang === 'ar';

  return { lang, isRtl, toggleLanguage };
}
