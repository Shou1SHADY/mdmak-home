"use client";

import { useLanguageContext } from '@/components/LanguageProvider';
import { translations } from '@/lib/translations';
import { motion } from 'framer-motion';
import { Check, ClipboardList, TrendingUp, Building2 } from 'lucide-react';

export function HowItWorks() {
  const { lang, isRtl } = useLanguageContext();
  const t = translations[lang];

  const steps = [
    { 
      id: '01', 
      title: t.howItWorks.step1, 
      desc: t.howItWorks.desc1,
      icon: ClipboardList
    },
    { 
      id: '02', 
      title: t.howItWorks.step2, 
      desc: t.howItWorks.desc2,
      icon: TrendingUp
    },
    { 
      id: '03', 
      title: t.howItWorks.step3, 
      desc: t.howItWorks.desc3,
      icon: Building2
    }
  ];

  return (
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-primary mb-16">{t.howItWorks.title}</h2>
        
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
          <div className="hidden lg:block absolute top-24 left-1/4 right-1/4 h-px border-t-2 border-dashed border-primary/10 -z-10" />
          
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center group"
            >
              <div className="w-20 h-20 rounded-3xl bg-white shadow-xl shadow-primary/5 flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform">
                <step.icon className="w-10 h-10 text-primary" />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent text-primary text-xs font-black flex items-center justify-center border-4 border-background">
                  {step.id}
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
