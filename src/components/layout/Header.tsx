"use client";

import { useLanguageContext } from '@/components/LanguageProvider';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Globe, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  const { lang, toggleLanguage, isRtl } = useLanguageContext();
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl font-extrabold tracking-tight text-primary flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-xs">MH</span>
            </div>
            <span>MDMAK HOME</span>
          </motion.div>
          
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-accent transition-colors">{t.nav.products}</a>
            <a href="#" className="text-sm font-medium hover:text-accent transition-colors">{t.nav.contractors}</a>
            <a href="#" className="text-sm font-medium hover:text-accent transition-colors">{t.nav.howItWorks}</a>
            <a href="#estimator" className="text-sm font-medium hover:text-accent transition-colors">{t.nav.estimator}</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={toggleLanguage} className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">{lang === 'ar' ? 'English' : 'العربية'}</span>
          </Button>
          
          <Button variant="outline" size="sm" className="hidden sm:flex rounded-full border-primary/20">
            {t.nav.quotes}
          </Button>
          
          <Button size="sm" className="rounded-full shadow-lg shadow-primary/10">
            {lang === 'ar' ? 'ابدأ الآن' : 'Get Started'}
          </Button>
          
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
