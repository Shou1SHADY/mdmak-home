"use client";

import { useLanguageContext } from '@/components/LanguageProvider';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function CTASection() {
  const { lang } = useLanguageContext();
  const t = translations[lang];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-accent rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-white rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-black text-primary mb-6 leading-tight">
              {t.cta.headline}
            </h2>
            <p className="text-lg text-primary/80 mb-10 max-w-xl mx-auto">
              {t.cta.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-10 rounded-full bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                {t.cta.button}
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-full border-primary/20 text-primary font-bold text-lg bg-white/30 backdrop-blur-sm hover:bg-white/50">
                {lang === 'ar' ? 'تواصل مع المبيعات' : 'Contact Sales'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
