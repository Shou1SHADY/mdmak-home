
"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useLanguageContext } from '@/components/LanguageProvider';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Heart, 
  Star,
  Bell,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CustomerStats } from '@/components/dashboard/CustomerStats';
import { CustomerSpendChart } from '@/components/dashboard/CustomerSpendChart';
import { CustomerActivityFeed } from '@/components/dashboard/CustomerActivityFeed';
import { RFQList } from '@/components/dashboard/RFQList';
import Link from 'next/link';
import { useMemoFirebase } from '@/firebase/firestore/use-doc';

export default function CustomerDashboardPage() {
  const { lang, isRtl } = useLanguageContext();
  const { user } = useUser();
  const db = useFirestore();
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState('overview');

  // Queries
  const customerRFQsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'rfqs'), 
      where('customerId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [db, user]);

  const { data: recentRFQs, loading: rfqsLoading } = useCollection(customerRFQsQuery);

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['customer', 'admin']}>
        <div className="min-h-screen bg-muted/20" dir={isRtl ? 'rtl' : 'ltr'}>
          <Header />
          
          <main className="container mx-auto px-4 py-8 lg:py-12">
            {/* Fintech Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-1">
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 py-1 font-bold text-[10px] uppercase tracking-wider mb-2">
                  {isAr ? 'حساب شخصي' : 'Personal Account'}
                </Badge>
                <h1 className="text-4xl font-black text-primary leading-none">
                  {isAr ? `مرحباً، ${user?.displayName?.split(' ')[0] || 'بك'}` : `Hello, ${user?.displayName?.split(' ')[0] || 'there'}`}
                </h1>
                <p className="text-muted-foreground font-medium">
                  {isAr ? 'نظرة عامة على مشاريعك ومشترياتك.' : 'An overview of your projects and procurement.'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-2xl h-14 w-14 p-0 bg-white border-2">
                  <Bell className="w-5 h-5 text-primary" />
                </Button>
                <Button className="rounded-2xl h-14 px-8 font-black shadow-xl shadow-primary/20 gap-2" asChild>
                  <Link href="/rfq/create">
                    <Plus className="w-5 h-5" />
                    {isAr ? 'مشروع جديد' : 'New Project'}
                  </Link>
                </Button>
              </div>
            </div>

            <CustomerStats />

            <div className="grid lg:grid-cols-12 gap-8 mt-12">
              {/* Main Content Column */}
              <div className="lg:col-span-8 space-y-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                  <TabsList className="bg-white/50 border p-1 rounded-[1.5rem] h-14 w-full md:w-auto overflow-x-auto justify-start">
                    <TabsTrigger value="overview" className="rounded-xl px-8 h-full font-bold gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      {isAr ? 'نظرة عامة' : 'Overview'}
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="rounded-xl px-8 h-full font-bold gap-2">
                      <ClipboardList className="w-4 h-4" />
                      {isAr ? 'المشاريع' : 'Projects'}
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="rounded-xl px-8 h-full font-bold gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      {isAr ? 'الطلبات' : 'Orders'}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-8">
                    <CustomerSpendChart />
                    
                    <Card className="rounded-[2.5rem] border-0 shadow-sm bg-white overflow-hidden">
                      <CardHeader className="p-8 border-b flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold">{isAr ? 'طلبات عروض الأسعار النشطة' : 'Active RFQ Progress'}</CardTitle>
                          <CardDescription>{isAr ? 'تتبع حالة عروض الأسعار المستلمة' : 'Track the status of received quotations'}</CardDescription>
                        </div>
                        <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-xl" asChild>
                          <Link href="/customer-dashboard?tab=projects">{isAr ? 'عرض الكل' : 'View All'}</Link>
                        </Button>
                      </CardHeader>
                      <div className="p-0">
                        <RFQList limitCount={3} compact />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="projects">
                    <Card className="rounded-[2.5rem] border-0 shadow-sm bg-white overflow-hidden">
                      <CardHeader className="p-8 border-b">
                        <CardTitle className="text-xl font-bold">{isAr ? 'إدارة المشاريع' : 'Project Management'}</CardTitle>
                      </CardHeader>
                      <RFQList />
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar Column */}
              <div className="lg:col-span-4 space-y-8">
                <CustomerActivityFeed />

                <Card className="rounded-[2.5rem] border-0 shadow-sm bg-primary text-white p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <h4 className="font-bold text-lg mb-6">{isAr ? 'العناصر المحفوظة' : 'Saved Items'}</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary">
                          <Heart className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm">{isAr ? 'المنتجات المحفوظة' : 'Saved Products'}</span>
                      </div>
                      <Badge className="bg-white/20 text-white border-0">12</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary">
                          <Star className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm">{isAr ? 'المقاولون المفضلون' : 'Favorite Contractors'}</span>
                      </div>
                      <Badge className="bg-white/20 text-white border-0">4</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      <span className="text-xs font-bold uppercase tracking-widest text-white/60">{isAr ? 'تحليل التوفير' : 'Savings Analysis'}</span>
                    </div>
                    <p className="text-2xl font-black text-accent mb-2">SAR 4,250</p>
                    <p className="text-sm text-white/70 leading-relaxed italic">
                      {isAr 
                        ? 'لقد وفرت ١٥٪ من ميزانيتك هذا الشهر عبر مقارنة الأسعار في مدمك.' 
                        : 'You saved 15% of your budget this month by comparing prices on MDMAK.'}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}
