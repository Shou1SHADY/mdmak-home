"use client";

import { use, useState } from 'react';
import { useFirestore, useUser, useDoc, useCollection } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLanguageContext } from '@/components/LanguageProvider';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Calendar, 
  Loader2, 
  CheckCircle2, 
  BarChart3,
  FileText,
  User,
  TrendingUp
} from 'lucide-react';
import { RFQ, Quotation } from '@/types/rfq';
import { useMemoFirebase } from '@/firebase/firestore/use-doc';
import { QuotationService } from '@/services/quotation.service';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RFQDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const { lang, isRtl } = useLanguageContext();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const rfqRef = useMemoFirebase(() => doc(db, 'rfqs', id), [db, id]);
  const { data: rfq, loading: rfqLoading } = useDoc<RFQ>(rfqRef);

  const quotesRef = useMemoFirebase(() => collection(db, 'rfqs', id, 'quotations'), [db, id]);
  const { data: quotations, loading: quotesLoading } = useCollection<Quotation>(quotesRef);

  const [quoteForm, setQuoteForm] = useState({
    price: '',
    deliveryTime: '',
    notes: '',
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);

  const isCustomer = user?.uid === rfq?.customerId;
  const isSupplier = user && !isCustomer;

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !rfq) return;

    setSubmittingQuote(true);
    try {
      await QuotationService.submitQuotation(
        db,
        id,
        {
          price: Number(quoteForm.price),
          deliveryTime: quoteForm.deliveryTime,
          notes: quoteForm.notes
        },
        user.uid,
        user.displayName || user.email || 'Supplier'
      );
      
      toast({
        title: isAr ? "تم إرسال العرض" : "Quote Submitted",
        description: isAr ? "تم إرسال عرضك بنجاح للعميل." : "Your quote has been sent to the customer.",
      });
      setQuoteForm({ price: '', deliveryTime: '', notes: '' });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setSubmittingQuote(false);
    }
  };

  if (rfqLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!rfq) {
    return <div className="p-20 text-center">RFQ not found.</div>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/20" dir={isRtl ? 'rtl' : 'ltr'}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          
          <div className="flex flex-col lg:flex-row gap-8 mb-8 items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full bg-white text-primary font-bold uppercase tracking-wider">
                  {rfq.projectType}
                </Badge>
                <Badge className={rfq.status === 'open' ? 'bg-emerald-500' : 'bg-muted text-muted-foreground'}>
                  {rfq.status.toUpperCase()}
                </Badge>
              </div>
              <h1 className="text-4xl font-black text-primary leading-tight">
                {rfq.projectName}
              </h1>
              <div className="flex flex-wrap gap-6 text-muted-foreground text-sm font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {rfq.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {rfq.createdAt ? new Date(rfq.createdAt.seconds * 1000).toLocaleDateString() : '...'}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  {rfq.customerName}
                </div>
              </div>
            </div>

            {isCustomer && quotations.length > 1 && (
              <Button asChild size="lg" className="rounded-2xl h-14 px-8 shadow-lg shadow-primary/20">
                <Link href={`/rfq/${id}/compare`}>
                  <BarChart3 className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                  {isAr ? 'مقارنة العروض' : 'Compare Quotes'}
                </Link>
              </Button>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="rounded-[2.5rem] overflow-hidden border-0 shadow-sm bg-white">
                <CardHeader className="p-8 border-b">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    {isAr ? 'تفاصيل المشروع' : 'Project Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="p-6 bg-muted/20 rounded-3xl">
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-1">{isAr ? 'الميزانية' : 'Budget'}</p>
                      <p className="text-2xl font-black text-primary">{rfq.budget.toLocaleString()} SAR</p>
                    </div>
                    <div className="p-6 bg-muted/20 rounded-3xl">
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-1">{isAr ? 'الجدول الزمني' : 'Timeline'}</p>
                      <p className="text-2xl font-black text-primary">{rfq.timeline}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-3">{isAr ? 'الوصف' : 'Description'}</h4>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {rfq.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {isCustomer && (
                <section>
                  <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    {isAr ? 'العروض المستلمة' : 'Received Quotations'}
                    <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                      {quotations.length}
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {quotations.length > 0 ? quotations.map((q) => (
                      <Card key={q.id} className="rounded-3xl border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center font-black text-primary">
                              {q.supplierName?.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-primary">{q.supplierName}</h4>
                              <p className="text-xs text-muted-foreground">{isAr ? 'منذ' : 'Posted'} {q.createdAt ? new Date(q.createdAt.seconds * 1000).toLocaleDateString() : '...'}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-8 text-center md:text-left">
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">{isAr ? 'السعر' : 'Price'}</p>
                              <p className="font-black text-lg text-primary">{q.price.toLocaleString()} SAR</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">{isAr ? 'التوصيل' : 'Delivery'}</p>
                              <p className="font-bold text-muted-foreground">{q.deliveryTime}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {q.status === 'pending' ? (
                              <>
                                <Button variant="outline" size="sm" className="rounded-full">{isAr ? 'رفض' : 'Reject'}</Button>
                                <Button size="sm" className="rounded-full">{isAr ? 'قبول العرض' : 'Accept'}</Button>
                              </>
                            ) : (
                              <Badge className={q.status === 'accepted' ? 'bg-emerald-500' : 'bg-red-500'}>
                                {q.status.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )) : (
                      <div className="p-12 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-muted">
                        <p className="text-muted-foreground">{isAr ? 'لا توجد عروض حتى الآن' : 'No quotes yet'}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-8">
              {isSupplier && (
                <Card className="rounded-[2.5rem] overflow-hidden border-0 shadow-xl bg-primary text-white">
                  <CardHeader className="p-8">
                    <CardTitle className="text-xl font-bold">{isAr ? 'إرسال عرض سعر' : 'Submit Quotation'}</CardTitle>
                    <CardDescription className="text-white/60">
                      {isAr ? 'قدم عرضك المنافس لهذا المشروع' : 'Provide your competitive bid for this project'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <form onSubmit={handleQuoteSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white/80">{isAr ? 'السعر الإجمالي (ر.س)' : 'Total Price (SAR)'}</Label>
                        <Input 
                          type="number"
                          required
                          className="bg-white/10 border-white/20 text-white rounded-xl h-12"
                          value={quoteForm.price}
                          onChange={(e) => setQuoteForm({...quoteForm, price: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/80">{isAr ? 'مدة التوصيل' : 'Delivery Time'}</Label>
                        <Input 
                          required
                          className="bg-white/10 border-white/20 text-white rounded-xl h-12"
                          placeholder={isAr ? 'مثال: ٣ أيام عمل' : 'e.g. 3 business days'}
                          value={quoteForm.deliveryTime}
                          onChange={(e) => setQuoteForm({...quoteForm, deliveryTime: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/80">{isAr ? 'ملاحظات إضافية' : 'Additional Notes'}</Label>
                        <Textarea 
                          className="bg-white/10 border-white/20 text-white rounded-xl min-h-[100px]"
                          value={quoteForm.notes}
                          onChange={(e) => setQuoteForm({...quoteForm, notes: e.target.value})}
                        />
                      </div>
                      <Button type="submit" className="w-full h-14 rounded-2xl bg-accent text-primary font-bold hover:bg-accent/90" disabled={submittingQuote}>
                        {submittingQuote ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAr ? 'إرسال العرض' : 'Send Quote')}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              <Card className="rounded-[2.5rem] overflow-hidden border-0 shadow-sm bg-white p-8">
                <h4 className="font-bold text-primary mb-6">{isAr ? 'إرشادات المنصة' : 'Platform Guidelines'}</h4>
                <div className="space-y-4">
                  {[
                    isAr ? 'تأكد من دقة المواصفات المطلوبة' : 'Ensure accuracy of specifications',
                    isAr ? 'التواصل يتم عبر المنصة فقط' : 'Communication strictly via platform',
                    isAr ? 'جميع الأسعار تشمل ضريبة القيمة المضافة' : 'Prices include VAT where applicable'
                  ].map((text, i) => (
                    <div key={i} className="flex gap-3 items-start text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {text}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
