
"use client";

import { use, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useDoc } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { ContractorProfile } from '@/types/contractor';
import { useLanguageContext } from '@/components/LanguageProvider';
import { 
  Loader2, 
  MapPin, 
  Star, 
  ShieldCheck, 
  FileCheck, 
  Award,
  MessageCircle,
  Phone,
  LayoutGrid,
  History,
  Info,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import Link from 'next/link';
import { useMemoFirebase } from '@/firebase/firestore/use-doc';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ContractorDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const { lang, isRtl } = useLanguageContext();
  const db = useFirestore();
  const isAr = lang === 'ar';

  const contractorRef = useMemoFirebase(() => doc(db, 'contractors', id), [db, id]);
  const { data: contractor, loading } = useDoc<ContractorProfile>(contractorRef);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{isAr ? 'الملف الشخصي غير موجود' : 'Profile Not Found'}</h2>
        <Button asChild>
          <Link href="/contractors">{isAr ? 'العودة للقائمة' : 'Back to Listing'}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? 'rtl' : 'ltr'}>
      <Header />

      <main className="container mx-auto px-4 py-8 lg:py-12">
        {/* Profile Hero */}
        <div className="relative rounded-[3rem] overflow-hidden bg-primary text-white p-8 lg:p-16 mb-12 shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/10 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 relative z-10">
            <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-[2.5rem] bg-white shadow-xl flex items-center justify-center overflow-hidden shrink-0 border-4 border-white/20">
              {contractor.logo ? (
                <Image src={contractor.logo} alt={contractor.companyName} fill className="object-cover" />
              ) : (
                <span className="text-5xl font-black text-primary">{contractor.companyName.charAt(0)}</span>
              )}
            </div>

            <div className="flex-1 text-center lg:text-right">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                <Badge className="bg-accent text-primary font-bold px-4 py-1">{isAr ? 'مقاول معتمد' : 'Certified Contractor'}</Badge>
                {contractor.verified && (
                  <div className="flex items-center gap-1 text-emerald-400 font-bold bg-white/10 px-3 py-1 rounded-full text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    {isAr ? 'موثق' : 'Verified'}
                  </div>
                )}
              </div>
              <h1 className="text-4xl lg:text-6xl font-black mb-4">{contractor.companyName}</h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/70">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  {contractor.location}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-yellow-400 text-primary px-2 py-0.5 rounded-lg font-black text-sm">
                    <Star className="w-4 h-4 fill-primary" />
                    {contractor.rating}
                  </div>
                  <span>({contractor.reviewsCount} {isAr ? 'مراجعة' : 'Reviews'})</span>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button size="lg" className="rounded-2xl h-14 px-10 bg-white text-primary font-black hover:bg-white/90 shadow-xl shadow-black/10 gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {isAr ? 'تواصل الآن' : 'Contact Now'}
                </Button>
                <Button size="lg" variant="outline" className="rounded-2xl h-14 px-10 border-white/20 text-white hover:bg-white/10 font-bold gap-2" asChild>
                  <Link href="/rfq/create">
                    <FileCheck className="w-5 h-5" />
                    {isAr ? 'طلب عرض سعر' : 'Request Quote'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="about" className="space-y-8">
              <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 w-full justify-start overflow-x-auto">
                <TabsTrigger value="about" className="rounded-xl px-8 h-full font-bold gap-2">
                  <Info className="w-4 h-4" />
                  {isAr ? 'عن الشركة' : 'About'}
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="rounded-xl px-8 h-full font-bold gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  {isAr ? 'سابقة الأعمال' : 'Portfolio'}
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-xl px-8 h-full font-bold gap-2">
                  <History className="w-4 h-4" />
                  {isAr ? 'المراجعات' : 'Reviews'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-primary">{isAr ? 'نبذة تعريفية' : 'Company Overview'}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {contractor.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="rounded-[2rem] border-0 shadow-sm bg-muted/20 p-8">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        {isAr ? 'الخدمات المتخصصة' : 'Specialized Services'}
                      </CardTitle>
                    </CardHeader>
                    <div className="flex flex-wrap gap-2">
                      {contractor.services.map((service, i) => (
                        <Badge key={i} className="bg-white text-primary border shadow-sm py-2 px-4 rounded-xl font-bold">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </Card>

                  <Card className="rounded-[2rem] border-0 shadow-sm bg-muted/20 p-8">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-primary" />
                        {isAr ? 'الشهادات والاعتمادات' : 'Certifications'}
                      </CardTitle>
                    </CardHeader>
                    <div className="space-y-3">
                      {contractor.certifications.map((cert, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-medium text-muted-foreground bg-white p-3 rounded-xl border">
                          <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                          {cert}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contractor.portfolio.map((item, i) => (
                    <Card key={i} className="rounded-[2.5rem] overflow-hidden border-0 shadow-lg group">
                      <div className="relative aspect-[4/3]">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                          <h4 className="text-white font-black text-xl">{item.title}</h4>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="p-20 text-center bg-muted/20 rounded-[3rem] border-2 border-dashed">
                  <p className="text-muted-foreground">{isAr ? 'لا توجد مراجعات متاحة حالياً.' : 'No reviews available at the moment.'}</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="rounded-[2.5rem] overflow-hidden border-0 shadow-xl bg-white sticky top-24">
              <CardHeader className="p-8 border-b">
                <CardTitle className="text-xl font-bold">{isAr ? 'معلومات الاتصال' : 'Contact Information'}</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">{isAr ? 'رقم الهاتف' : 'Phone'}</p>
                      <p className="font-bold text-primary">+966 5X XXX XXXX</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">{isAr ? 'المكتب الرئيسي' : 'Main Office'}</p>
                      <p className="font-bold text-primary">{contractor.city}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">{isAr ? 'ساعات العمل' : 'Working Hours'}</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isAr ? 'الأحد - الخميس' : 'Sun - Thu'}</span>
                    <span className="font-bold">08:00 AM - 05:00 PM</span>
                  </div>
                </div>

                <Button className="w-full h-14 rounded-2xl font-black text-lg gap-2 mt-4" asChild>
                  <Link href="/rfq/create">
                    {isAr ? 'اطلب تسعيرة' : 'Request Estimate'}
                    <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
