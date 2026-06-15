"use client";

import { use, useMemo } from 'react';
import { useFirestore, useUser, useDoc, useCollection } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLanguageContext } from '@/components/LanguageProvider';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RFQ, Quotation } from '@/types/rfq';
import { 
  Trophy, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  BarChart3,
  ArrowRight,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useMemoFirebase } from '@/firebase/firestore/use-doc';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CompareQuotesPage({ params }: PageProps) {
  const { id } = use(params);
  const { lang, isRtl } = useLanguageContext();
  const db = useFirestore();
  const isAr = lang === 'ar';

  const rfqRef = useMemoFirebase(() => doc(db, 'rfqs', id), [db, id]);
  const { data: rfq, loading: rfqLoading } = useDoc<RFQ>(rfqRef);

  const quotesRef = useMemoFirebase(() => collection(db, 'rfqs', id, 'quotations'), [db, id]);
  const { data: quotations, loading: quotesLoading } = useCollection<Quotation>(quotesRef);

  const metrics = useMemo(() => {
    if (!quotations || quotations.length === 0) return null;

    const prices = quotations.map(q => q.price);
    const lowestPrice = Math.min(...prices);
    
    // Simplistic scoring for comparison page
    const bestValueQuote = quotations.reduce((prev, curr) => (prev.price < curr.price ? prev : curr));

    return {
      lowestPrice,
      bestValueId: bestValueQuote.id
    };
  }, [quotations]);

  if (rfqLoading || quotesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!rfq || quotations.length === 0) {
    return <div className="p-20 text-center">No quotes to compare.</div>;
  }

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['customer', 'admin']}>
        <div className="min-h-screen bg-muted/20" dir={isRtl ? 'rtl' : 'ltr'}>
          <Header />

          <main className="container mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-12">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-widest">{isAr ? 'محرك المقارنة' : 'COMPARISON ENGINE'}</span>
                </div>
                <h1 className="text-4xl font-black text-primary">
                  {isAr ? 'مقارنة عروض المشروع' : 'Compare Project Quotes'}
                </h1>
                <p className="text-muted-foreground">
                  {isAr ? `مشروع: ${rfq.projectName}` : `Project: ${rfq.projectName}`}
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden bg-emerald-50 text-emerald-900 border-2 border-emerald-100/50">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-emerald-200 text-emerald-800 border-0">{isAr ? 'الأقل سعراً' : 'Lowest Price'}</Badge>
                    <DollarSign className="w-5 h-5 opacity-50" />
                  </div>
                  <CardTitle className="text-3xl font-black mt-4">
                    {metrics?.lowestPrice.toLocaleString()} <span className="text-sm font-bold uppercase">SAR</span>
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden bg-primary text-white shadow-xl shadow-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-accent text-primary border-0">{isAr ? 'أفضل قيمة' : 'Best Value'}</Badge>
                    <Trophy className="w-5 h-5 text-accent" />
                  </div>
                  <CardTitle className="text-3xl font-black mt-4">
                    {quotations.find(q => q.id === metrics?.bestValueId)?.supplierName}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card className="rounded-[2.5rem] overflow-hidden border-0 shadow-xl mb-12">
              <div className="p-8 border-b bg-white">
                <h3 className="text-xl font-black text-primary">{isAr ? 'جدول العروض التفصيلي' : 'Detailed Quotation Table'}</h3>
              </div>
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[250px] font-bold text-primary">{isAr ? 'المورد' : 'Supplier'}</TableHead>
                    <TableHead className="font-bold text-primary">{isAr ? 'السعر' : 'Price'}</TableHead>
                    <TableHead className="font-bold text-primary">{isAr ? 'مدة التوصيل' : 'Delivery'}</TableHead>
                    <TableHead className="font-bold text-primary">{isAr ? 'ملاحظات' : 'Notes'}</TableHead>
                    <TableHead className="text-right font-bold text-primary">{isAr ? 'الإجراء' : 'Action'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {quotations.map((q) => (
                    <TableRow key={q.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center font-black text-primary text-xs">
                            {q.supplierName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-primary">{q.supplierName}</span>
                              <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-black text-lg text-primary">{q.price.toLocaleString()} <span className="text-[10px] text-muted-foreground">SAR</span></span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-bold">{q.deliveryTime}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate font-medium text-muted-foreground">
                        {q.notes}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" className="rounded-full gap-2">
                          {isAr ? 'قبول' : 'Accept'}
                          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </main>
          <Footer />
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}