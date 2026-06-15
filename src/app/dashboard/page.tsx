
"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguageContext } from '@/components/LanguageProvider';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  ShoppingCart, 
  Bell,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductManager } from '@/components/dashboard/ProductManager';
import { RFQList } from '@/components/dashboard/RFQList';
import { OrderList } from '@/components/dashboard/OrderList';
import { useMemoFirebase } from '@/firebase/firestore/use-doc';

export default function DashboardPage() {
  const { lang, isRtl } = useLanguageContext();
  const { user } = useUser();
  const db = useFirestore();
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState('overview');

  // Stats Data Queries
  const supplierProductsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'products'), where('supplierId', '==', user.uid));
  }, [db, user]);

  const supplierQuotesQuery = useMemoFirebase(() => {
    if (!user) return null;
    // Note: This requires a composite index in production, but for MVP we search for quotations where supplierId matches
    // This is a placeholder as we'd normally want to see all RFQs first, then filter by those we've responded to.
    return query(collection(db, 'rfqs'), where('status', '==', 'open'));
  }, [db, user]);

  const { data: products } = useCollection(supplierProductsQuery);
  const { data: openRFQs } = useCollection(supplierQuotesQuery);

  const stats = [
    {
      title: isAr ? 'إجمالي المبيعات' : 'Total Revenue',
      value: 'SAR 45,230',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: isAr ? 'الطلبات النشطة' : 'Active Orders',
      value: '12',
      change: '+3',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: isAr ? 'طلبات عروض الأسعار' : 'New RFQs',
      value: openRFQs.length.toString(),
      change: isAr ? 'فرص جديدة' : 'New opportunities',
      icon: ClipboardList,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      title: isAr ? 'معدل التحويل' : 'Conversion Rate',
      value: '18.4%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/20" dir={isRtl ? 'rtl' : 'ltr'}>
        <Header />
        
        <main className="container mx-auto px-4 py-8 lg:py-12">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-black text-primary mb-2">
                {isAr ? 'لوحة التحكم للمورد' : 'Supplier Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {isAr ? `أهلاً بك مجدداً، ${user?.displayName || user?.email}` : `Welcome back, ${user?.displayName || user?.email}`}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl h-12 gap-2 bg-white">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">{isAr ? 'التنبيهات' : 'Notifications'}</span>
                <Badge className="bg-primary text-white h-5 w-5 p-0 flex items-center justify-center text-[10px]">3</Badge>
              </Button>
              <Button className="rounded-xl h-12 gap-2 shadow-lg shadow-primary/20" onClick={() => setActiveTab('products')}>
                <Plus className="w-4 h-4" />
                {isAr ? 'إضافة منتج جديد' : 'Add New Product'}
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-white/50 border p-1 rounded-2xl h-14 w-full md:w-auto overflow-x-auto justify-start md:justify-center">
              <TabsTrigger value="overview" className="rounded-xl px-6 h-full font-bold gap-2">
                <LayoutDashboard className="w-4 h-4" />
                {isAr ? 'نظرة عامة' : 'Overview'}
              </TabsTrigger>
              <TabsTrigger value="products" className="rounded-xl px-6 h-full font-bold gap-2">
                <Package className="w-4 h-4" />
                {isAr ? 'المنتجات' : 'Products'}
              </TabsTrigger>
              <TabsTrigger value="rfqs" className="rounded-xl px-6 h-full font-bold gap-2">
                <ClipboardList className="w-4 h-4" />
                {isAr ? 'طلبات الأسعار' : 'RFQs'}
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-xl px-6 h-full font-bold gap-2">
                <ShoppingCart className="w-4 h-4" />
                {isAr ? 'الطلبات' : 'Orders'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <Card key={idx} className="rounded-[2rem] border-0 shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <Badge variant="outline" className="text-[10px] font-black uppercase text-emerald-600 border-emerald-100 bg-emerald-50">
                          {stat.change}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                        <h3 className="text-2xl font-black text-primary">{stat.value}</h3>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent RFQs */}
                <Card className="lg:col-span-2 rounded-[2.5rem] border-0 shadow-sm bg-white">
                  <CardHeader className="p-8 border-b flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold">{isAr ? 'طلبات عروض الأسعار الأخيرة' : 'Recent RFQ Opportunities'}</CardTitle>
                      <CardDescription>{isAr ? 'فرص جديدة لمشاريع في منطقتك' : 'New project opportunities in your region'}</CardDescription>
                    </div>
                    <Button variant="ghost" className="text-primary font-bold" onClick={() => setActiveTab('rfqs')}>
                      {isAr ? 'عرض الكل' : 'View All'}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <RFQList limitCount={5} compact />
                  </CardContent>
                </Card>

                {/* Sales Analytics Summary */}
                <Card className="rounded-[2.5rem] border-0 shadow-sm bg-primary text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <CardHeader className="p-8">
                    <CardTitle className="text-xl font-bold">{isAr ? 'تحليل الأداء' : 'Performance Insights'}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                    <div className="p-6 bg-white/10 rounded-[2rem] border border-white/10">
                      <p className="text-sm text-white/60 mb-1">{isAr ? 'أكثر فئة طلباً' : 'Top Category'}</p>
                      <p className="text-2xl font-black text-accent">{isAr ? 'حديد التسليح' : 'Steel Rebar'}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">{isAr ? 'نسبة الاستجابة' : 'Response Rate'}</span>
                        <span className="text-sm font-bold">94%</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: '94%' }} />
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed italic">
                        {isAr 
                          ? 'استجابتك أسرع من ٨٠٪ من الموردين الآخرين. استمر في هذا الأداء لزيادة فرص الفوز بالعقود.' 
                          : 'Your response time is faster than 80% of other suppliers. Keep it up to win more contracts.'}
                      </p>
                    </div>
                    <Button className="w-full bg-white text-primary hover:bg-white/90 font-black rounded-2xl h-12">
                      {isAr ? 'تحميل تقرير الأداء' : 'Download Report'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products">
              <ProductManager />
            </TabsContent>

            <TabsContent value="rfqs">
              <Card className="rounded-[2.5rem] border-0 shadow-sm bg-white overflow-hidden">
                <CardHeader className="p-8 border-b">
                  <CardTitle className="text-xl font-bold">{isAr ? 'إدارة طلبات عروض الأسعار' : 'Manage RFQs'}</CardTitle>
                </CardHeader>
                <RFQList />
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <OrderList />
            </TabsContent>
          </Tabs>
        </main>
        
        <Footer />
      </div>
    </AuthGuard>
  );
}
