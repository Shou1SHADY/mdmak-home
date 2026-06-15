"use client";

import { useLanguageContext } from '@/components/LanguageProvider';
import { translations } from '@/lib/translations';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Construction, 
  Layers, 
  Palette, 
  Droplets, 
  Zap, 
  UtensilsCrossed, 
  Bath, 
  BrickWall 
} from 'lucide-react';

export function Categories() {
  const { lang } = useLanguageContext();
  const t = translations[lang];

  const categories = [
    { name: t.categories.cement, icon: BrickWall, color: 'bg-orange-500/10 text-orange-600' },
    { name: t.categories.steel, icon: Construction, color: 'bg-blue-500/10 text-blue-600' },
    { name: t.categories.tiles, icon: Layers, color: 'bg-purple-500/10 text-purple-600' },
    { name: t.categories.paint, icon: Palette, color: 'bg-pink-500/10 text-pink-600' },
    { name: t.categories.plumbing, icon: Droplets, color: 'bg-cyan-500/10 text-cyan-600' },
    { name: t.categories.electrical, icon: Zap, color: 'bg-yellow-500/10 text-yellow-600' },
    { name: t.categories.kitchens, icon: UtensilsCrossed, color: 'bg-emerald-500/10 text-emerald-600' },
    { name: t.categories.bathrooms, icon: Bath, color: 'bg-indigo-500/10 text-indigo-600' },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-primary">{t.categories.title}</h2>
          <button className="text-sm font-bold text-accent hover:underline">
            {lang === 'ar' ? 'عرض الكل' : 'View All'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-primary text-sm lg:text-base">{cat.name}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
