"use client";

import { useLanguageContext } from '@/components/LanguageProvider';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  const { lang, isRtl } = useLanguageContext();
  const t = translations[lang];

  return (
    <section className="relative py-16 lg:py-28 overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary-foreground text-xs font-bold mb-6 tracking-wider uppercase">
              {lang === 'ar' ? 'المنصة رقم ١ في المملكة' : '#1 Marketplace in KSA'}
            </span>
            <h1 className="text-4xl lg:text-7xl font-extrabold text-primary mb-6 leading-[1.15] lg:leading-[1.1]">
              {t.hero.headline}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              {t.hero.subheadline}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative max-w-2xl mx-auto mb-12"
          >
            <div className="flex items-center bg-white p-2 rounded-2xl shadow-xl shadow-primary/5 border">
              <div className="px-4 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <Input 
                placeholder={t.hero.searchPlaceholder} 
                className="border-0 focus-visible:ring-0 text-md h-12 bg-transparent"
              />
              <Button className="h-12 px-8 rounded-xl bg-primary text-white font-bold">
                {lang === 'ar' ? 'بحث' : 'Search'}
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-8 text-md font-bold flex items-center gap-2 bg-primary group">
              {t.hero.browseProducts}
              {isRtl ? <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-14 px-8 text-md font-bold border-primary/20 text-primary hover:bg-primary/5">
              {t.hero.requestQuotes}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
