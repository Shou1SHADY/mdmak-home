"use client";

import React, { createContext, useContext } from 'react';
import { useLanguage } from '@/hooks/use-language';

const LanguageContext = createContext<ReturnType<typeof useLanguage> | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const langData = useLanguage();
  
  return (
    <LanguageContext.Provider value={langData}>
      <div dir={langData.isRtl ? 'rtl' : 'ltr'} className={langData.isRtl ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguageContext must be used within LanguageProvider");
  return context;
};
