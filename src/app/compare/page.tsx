"use client";

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLanguageContext } from '@/components/LanguageProvider';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  BarChart3,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { SupplierOffer } from '@/types/marketplace';
import { ProcurementService } from '@/services/procurement.service';

export default function ComparisonPage() {
  const { lang, isRtl } = useLanguageContext();
  const isAr = lang === 'ar';

  const [offers] = useState<SupplierOffer[]>([
    {
      id: '1',
      supplierName: 'MDMAK Supply Co.',
      rating: 4.9,
      price: 1250,
      deliveryDays: 2,
      warranty: isAr ? 'سنتان' : '2 Years',
      stockStatus: 'in_stock',
      availability: 95,
      location: isAr ? 'الرياض' : 'Riyadh',
      verified: true
    },
    {
      id: '2',
      supplierName: 'Al-Bina Materials',
      rating: 4.7,
      price: 1180,
      deliveryDays: 5,
      warranty: isAr ? 'سنة واحدة' : '1 Year',
      stockStatus: 'in_stock',
      availability: 88,
      location: isAr ? 'جدة' : 'Jeddah',
      verified: true
    },
    {
      id: '3',
      supplierName: 'Sahara Construct',
      rating: 4.5,
      price: 1320,
      deliveryDays: 1,
      warranty: isAr ? '٣ سنوات' : '3 Years',
      stockStatus: 'low_stock',
      availability: 42,
      location: isAr ? 'الدمام' : 'Dammam',
      verified: true
    }
  ]);

  const metrics = useMemo(() => {
    const prices = offers.map(o => o.price);
    const deliveries = offers.map(o => o.deliveryDays);
    const maxPrice = Math.max(...prices);

    const calculatedOffers = offers.map(o => ({
      ...o,
      procurementScore: ProcurementService.calculateScore(o.price, o.rating, o.deliveryDays, prices, deliveries),
      savings: ProcurementService.calculateSavings(o.price, maxPrice)
    }));

    return {
      offers: calculatedOffers,
      lowestPrice: Math.min(...prices),
      fastestDelivery: Math.min(...deliveries),
      bestValueId: ProcurementService.getBestValueId(offers.map(o => ({ ...o, rating: o.rating, deliveryDays: o.deliveryDays })))
    };
  }, [offers]);

  const chartData = metrics.offers.map(o => ({
    name: o.supplierName,
    price: o.price,
    score: o.procurementScore
  }));

  const aiInsights = useMemo(() => ProcurementService.getInsights(metrics.offers, lang), [metrics.offers, lang]);

  return (
    <div className="min-h-screen bg-muted/20" dir={isRtl ? 'rtl' : 'ltr'}>
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest">{isAr ? 'محرك المقارنة الذكي' : 'SMART COMPARISON ENGINE'}</span>
            </div>
            <h1 className="text-4xl font-black text-primary">
              {isAr ? 'مقارنة عروض الموردين' : 'Supplier Offer Comparison'}
            </h1>
            <p className="text-muted-foreground">
              {isAr 
                ? 'تحليل دقيق لأفضل العروض المتاحة بناءً على السعر والجودة وسرعة التوصيل.' 
                : 'Advanced analysis of the best available offers based on price, quality, and delivery speed.'}
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-xl h-12 gap-2">
              <TrendingDown className="w-4 h-4" />
              {isAr ? 'تحليل التوفير' : 'Savings Analysis'}
            </Button>
            <Button className="rounded-xl h-12 gap-2 shadow-lg shadow-primary/20">
              {isAr ? 'تصدير التقرير' : 'Export Report'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden bg-emerald-50 text-emerald-900 border-2 border-emerald-100/50">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge className="bg-emerald-200 text-emerald-800 hover:bg-emerald-200 border-0">{isAr ? 'الأقل سعراً' : 'Lowest Price'}</Badge>
                <DollarSign className="w-5 h-5 opacity-50" />
              </div>
              <CardTitle className="text-3xl font-black mt-4">
                {metrics.lowestPrice.toLocaleString()} <span className="text-sm font-bold uppercase">{isAr ? 'ر.س' : 'SAR'}</span>
              </CardTitle>
              <CardDescription className="text-emerald-800/70 font-medium">
                {metrics.offers.find(o => o.price === metrics.lowestPrice)?.supplierName}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden bg-blue-50 text-blue-900 border-2 border-blue-100/50">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200 border-0">{isAr ? 'الأسرع توصيلاً' : 'Fastest Delivery'}</Badge>
                <Clock className="w-5 h-5 opacity-50" />
              </div>
              <CardTitle className="text-3xl font-black mt-4">
                {metrics.fastestDelivery} {isAr ? 'أيام' : 'Days'}
              </CardTitle>
              <CardDescription className="text-blue-800/70 font-medium">
                {metrics.offers.find(o => o.deliveryDays === metrics.fastestDelivery)?.supplierName}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden bg-primary text-white shadow-xl shadow-primary/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge className="bg-accent text-primary hover:bg-accent border-0">{isAr ? 'أفضل قيمة' : 'Best Value'}</Badge>
                <Trophy className="w-5 h-5 text-accent" />
              </div>
              <CardTitle className="text-3xl font-black mt-4">
                {metrics.offers.find(o => o.id === metrics.bestValueId)?.procurementScore}%
              </CardTitle>
              <CardDescription className="text-white/70 font-medium">
                {metrics.offers.find(o => o.id === metrics.bestValueId)?.supplierName}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="rounded-[2.5rem] overflow-hidden border-0 shadow-xl mb-12">
          <div className="p-8 border-b bg-white">
            <h3 className="text-xl font-black text-primary">{isAr ? 'تحليل المواصفات التفصيلي' : 'Detailed Specification Analysis'}</h3>
          </div>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[250px] font-bold text-primary">{isAr ? 'المورد' : 'Supplier'}</TableHead>
                <TableHead className="font-bold text-primary">{isAr ? 'السعر' : 'Price'}</TableHead>
                <TableHead className="font-bold text-primary">{isAr ? 'مدة التوصيل' : 'Delivery'}</TableHead>
                <TableHead className="font-bold text-primary">{isAr ? 'الضمان' : 'Warranty'}</TableHead>
                <TableHead className="font-bold text-primary">{isAr ? 'التوفر' : 'Availability'}</TableHead>
                <TableHead className="font-bold text-primary">{isAr ? 'درجة المشتريات' : 'Procurement Score'}</TableHead>
                <TableHead className="text-right font-bold text-primary">{isAr ? 'الإجراء' : 'Action'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {metrics.offers.map((offer) => (
                <TableRow key={offer.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center font-black text-primary text-xs">
                        {offer.supplierName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-primary">{offer.supplierName}</span>
                          {offer.verified && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold">
                          <CheckCircle2 className="w-2 h-2" />
                          {offer.location}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-black text-lg text-primary">{offer.price.toLocaleString()} <span className="text-[10px] text-muted-foreground">SAR</span></span>
                      {offer.savings > 0 && (
                        <span className="text-[10px] text-emerald-600 font-bold">
                          {isAr ? `توفير ${offer.savings}%` : `Save ${offer.savings}%`}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-bold">{offer.deliveryDays} {isAr ? 'أيام' : 'Days'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">
                    {offer.warranty}
                  </TableCell>
                  <TableCell>
                    <div className="w-32 space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className={offer.stockStatus === 'low_stock' ? 'text-orange-600' : 'text-emerald-600'}>
                          {offer.stockStatus === 'in_stock' ? (isAr ? 'متوفر' : 'In Stock') : (isAr ? 'محدود' : 'Low Stock')}
                        </span>
                        <span>{offer.availability}%</span>
                      </div>
                      <Progress value={offer.availability} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-black text-xs ${
                        offer.procurementScore > 85 ? 'border-emerald-500 text-emerald-600' : 
                        offer.procurementScore > 70 ? 'border-blue-500 text-blue-600' : 
                        'border-orange-500 text-orange-600'
                      }`}>
                        {offer.procurementScore}
                      </div>
                      {offer.id === metrics.bestValueId && (
                        <Badge className="bg-accent text-primary border-0">{isAr ? 'موصى به' : 'Recommended'}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="rounded-full gap-2">
                      {isAr ? 'اختيار' : 'Select'}
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="rounded-[2.5rem] border-0 shadow-lg p-8">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-xl font-black text-primary">{isAr ? 'مقارنة الأسعار' : 'Price Benchmarking'}</CardTitle>
              <CardDescription>{isAr ? 'توزيع التكلفة بين الموردين المختارين' : 'Cost distribution among selected suppliers'}</CardDescription>
            </CardHeader>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="price" radius={[8, 8, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.price === metrics.lowestPrice ? '#10b981' : '#1e293b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="rounded-[2.5rem] border-0 shadow-lg p-8 bg-primary text-white">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-xl font-black">{isAr ? 'ملخص التوفير المتوقع' : 'Projected Savings Summary'}</CardTitle>
            </CardHeader>
            <div className="space-y-8">
              <div className="flex items-center justify-between p-6 bg-white/10 rounded-[2rem] border border-white/5">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white/70">{isAr ? 'إجمالي التوفير الممكن' : 'Total Potential Savings'}</p>
                  <p className="text-3xl font-black text-accent">SAR {(Math.max(...offers.map(o => o.price)) - metrics.lowestPrice).toLocaleString()}</p>
                </div>
                <div className="w-16 h-16 rounded-3xl bg-accent flex items-center justify-center text-primary">
                  <TrendingDown className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="font-bold text-sm uppercase tracking-widest text-white/60">{isAr ? 'رؤى الذكاء الاصطناعي' : 'AI Procurement Insights'}</h4>
                <div className="space-y-4">
                  {aiInsights.map((insight, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${i === 0 ? 'bg-accent' : 'bg-blue-400'}`} />
                      <p className="text-sm leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full h-14 rounded-2xl bg-white text-primary font-black hover:bg-white/90">
                {isAr ? 'اعتماد العرض المختار' : 'Approve Selected Offer'}
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
