
"use client";

import { useLanguageContext } from '@/components/LanguageProvider';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Globe, Menu, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserNav } from './UserNav';
import { useUser } from '@/firebase/auth/use-user';
import Link from 'next/link';

export function Header() {
  const { lang, toggleLanguage, isRtl } = useLanguageContext();
  const { user, loading } = useUser();
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-2xl font-extrabold tracking-tight text-primary flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-black">M</span>
              </div>
              <span className="hidden sm:inline">MDMAK HOME</span>
            </motion.div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/marketplace" className="text-sm font-bold hover:text-accent transition-colors">{t.nav.products}</Link>
            <Link href="#" className="text-sm font-medium hover:text-accent transition-colors">{t.nav.contractors}</Link>
            <Link href="#" className="text-sm font-medium hover:text-accent transition-colors">{t.nav.howItWorks}</Link>
            <Link href="/#estimator" className="text-sm font-medium hover:text-accent transition-colors">{t.nav.estimator}</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={toggleLanguage} className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">{lang === 'ar' ? 'English' : 'العربية'}</span>
          </Button>

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-primary text-[10px] font-black rounded-full flex items-center justify-center">0</span>
            </Link>
          </Button>
          
          {!loading && user ? (
            <UserNav />
          ) : (
            <>
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-full border-primary/20" asChild>
                <Link href="/login">{lang === 'ar' ? 'دخول' : 'Login'}</Link>
              </Button>
              <Button size="sm" className="rounded-full shadow-lg shadow-primary/10" asChild>
                <Link href="/register">{lang === 'ar' ? 'ابدأ الآن' : 'Get Started'}</Link>
              </Button>
            </>
          )}
          
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
