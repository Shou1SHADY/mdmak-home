"use client";

import { useState } from 'react';
import { useLanguageContext } from '@/components/LanguageProvider';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { aiMaterialCostEstimator, type AiMaterialCostEstimatorOutput } from '@/ai/flows/ai-material-cost-estimator-flow';
import { motion, AnimatePresence } from 'framer-motion';

export function CostEstimator() {
  const { lang, isRtl } = useLanguageContext();
  const t = translations[lang];

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiMaterialCostEstimatorOutput | null>(null);

  const [formData, setFormData] = useState({
    projectType: 'renovation' as const,
    area: 100,
    quality: 'standard' as const,
    region: lang === 'ar' ? 'الرياض' : 'Riyadh',
    notes: '',
  });

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const output = await aiMaterialCostEstimator({
        projectType: formData.projectType,
        areaInSquareMeters: formData.area,
        materialQuality: formData.quality,
        region: formData.region,
        notes: formData.notes,
      });
      setResult(output);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="estimator" className="py-24 bg-primary text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4 text-accent">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Powered by AI</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                {t.estimator.title}
              </h2>
              <p className="text-lg text-primary-foreground/70 mb-10">
                {t.estimator.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/10">
                <div className="space-y-2">
                  <Label className="text-white/60">{t.estimator.projectType}</Label>
                  <Select 
                    value={formData.projectType} 
                    onValueChange={(v: any) => setFormData({...formData, projectType: v})}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new_construction">{lang === 'ar' ? 'بناء جديد' : 'New Construction'}</SelectItem>
                      <SelectItem value="renovation">{lang === 'ar' ? 'ترميم' : 'Renovation'}</SelectItem>
                      <SelectItem value="furnishing">{lang === 'ar' ? 'تأثيث' : 'Furnishing'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60">{t.estimator.area}</Label>
                  <Input 
                    type="number" 
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: Number(e.target.value)})}
                    className="bg-white/5 border-white/10 text-white rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60">{t.estimator.quality}</Label>
                  <Select 
                    value={formData.quality}
                    onValueChange={(v: any) => setFormData({...formData, quality: v})}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">{lang === 'ar' ? 'اقتصادي' : 'Economy'}</SelectItem>
                      <SelectItem value="standard">{lang === 'ar' ? 'عادي' : 'Standard'}</SelectItem>
                      <SelectItem value="premium">{lang === 'ar' ? 'فاخر' : 'Premium'}</SelectItem>
                      <SelectItem value="luxury">{lang === 'ar' ? 'VIP' : 'Luxury'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60">{t.estimator.region}</Label>
                  <Input 
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="bg-white/5 border-white/10 text-white rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <Label className="text-white/60">{t.estimator.notes}</Label>
                  <Input 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder={lang === 'ar' ? 'مثلاً: نوع البلاط المفضل...' : 'E.g. preferred tile type...'}
                    className="bg-white/5 border-white/10 text-white rounded-xl"
                  />
                </div>

                <Button 
                  onClick={handleCalculate} 
                  disabled={loading}
                  className="sm:col-span-2 h-14 rounded-2xl bg-accent text-primary font-bold hover:bg-accent/90 transition-all text-md"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.estimator.calculating}
                    </span>
                  ) : (
                    t.estimator.calculate
                  )}
                </Button>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white text-primary p-8 rounded-[2.5rem] shadow-2xl shadow-black/20 h-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-8 border-b pb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{t.estimator.resultTitle}</h3>
                      <p className="text-muted-foreground text-sm uppercase tracking-wide font-medium">Estimated in SAR</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="mb-10">
                    <p className="text-muted-foreground text-xs font-bold uppercase mb-3">{t.estimator.costRange}</p>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl lg:text-5xl font-black text-primary">
                        {result.estimatedCostRange.min.toLocaleString()} - {result.estimatedCostRange.max.toLocaleString()}
                      </span>
                      <span className="text-xl font-bold text-muted-foreground mb-1">SAR</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 flex-1">
                    <p className="text-muted-foreground text-xs font-bold uppercase">{t.estimator.recommendations}</p>
                    {result.materialRecommendations.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl">
                        <span className="font-semibold text-sm">{item.materialName}</span>
                        <div className="text-right">
                          <span className="font-bold text-md">{item.estimatedQuantity}</span>
                          <span className="text-xs text-muted-foreground ml-1 uppercase">{item.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-muted-foreground leading-relaxed italic bg-muted/30 p-4 rounded-xl">
                    {result.disclaimer}
                  </p>
                </motion.div>
              ) : (
                <div className="hidden lg:flex flex-col items-center justify-center h-full text-center p-12 border-2 border-dashed border-white/20 rounded-[2.5rem]">
                  <Sparkles className="w-16 h-16 text-accent/20 mb-6" />
                  <p className="text-white/40 font-medium">
                    {lang === 'ar' 
                      ? 'املأ البيانات على اليسار للحصول على تقرير تكاليف مفصل من الذكاء الاصطناعي' 
                      : 'Fill in the data on the left to get a detailed AI cost report'}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
