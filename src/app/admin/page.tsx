
"use client";

import { AdminStats } from '@/components/admin/AdminStats';
import { useLanguageContext } from '@/components/LanguageProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { lang, isRtl } = useLanguageContext();
  const isAr = lang === 'ar';

  const revenueData = [
    { name: 'Jan', revenue: 45000 },
    { name: 'Feb', revenue: 52000 },
    { name: 'Mar', revenue: 48000 },
    { name: 'Apr', revenue: 61000 },
    { name: 'May', revenue: 55000 },
    { name: 'Jun', revenue: 67000 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-primary leading-none">
            {isAr ? 'لوحة تحكم المشرف' : 'System Administration'}
          </h1>
          <p className="text-muted-foreground font-medium">
            {isAr ? 'مراقبة أداء المنصة وإدارة العمليات العالمية.' : 'Monitor platform performance and manage global operations.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl h-12 bg-white">
            {isAr ? 'تنزيل التقارير' : 'Download Reports'}
          </Button>
        </div>
      </div>

      <AdminStats />

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2.5rem] border-0 shadow-sm bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-black text-primary">{isAr ? 'نمو الإيرادات' : 'Revenue Growth'}</CardTitle>
            <CardDescription>{isAr ? 'أداء المبيعات خلال الـ ٦ أشهر الماضية' : 'Sales performance over last 6 months'}</CardDescription>
          </CardHeader>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="adminRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#adminRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-[2.5rem] border-0 shadow-sm bg-primary text-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <h4 className="font-bold text-lg">{isAr ? 'طلبات التوثيق المعلقة' : 'Pending Verifications'}</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                <span className="text-sm font-medium">{isAr ? 'الموردين' : 'Suppliers'}</span>
                <Badge className="bg-accent text-primary">12</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                <span className="text-sm font-medium">{isAr ? 'المقاولين' : 'Contractors'}</span>
                <Badge className="bg-accent text-primary">8</Badge>
              </div>
            </div>
          </div>
          <Button className="w-full bg-white text-primary hover:bg-white/90 font-black rounded-2xl h-12 mt-8" asChild>
            <Link href="/admin/approvals">
              {isAr ? 'مراجعة كافة الطلبات' : 'Review All Requests'}
            </Link>
          </Button>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="rounded-[2.5rem] border-0 shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-8 border-b">
            <CardTitle className="text-xl font-bold">{isAr ? 'أحدث المستخدمين' : 'Newest Users'}</CardTitle>
          </CardHeader>
          <div className="divide-y">
            {[1, 2, 3, 4].map((u) => (
              <div key={u} className="p-6 flex items-center justify-between hover:bg-muted/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center font-black text-primary">U</div>
                  <div>
                    <p className="font-bold text-sm text-primary">User {u}</p>
                    <p className="text-[10px] text-muted-foreground">user{u}@example.com</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-bold">Customer</Badge>
              </div>
            ))}
          </div>
          <div className="p-6 border-t text-center">
             <Button variant="ghost" className="text-primary font-bold text-xs" asChild>
               <Link href="/admin/users">{isAr ? 'عرض كافة المستخدمين' : 'View All Users'}</Link>
             </Button>
          </div>
        </Card>

        <Card className="rounded-[2.5rem] border-0 shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-8 border-b">
            <CardTitle className="text-xl font-bold">{isAr ? 'النشاط الأخير للمنصة' : 'Platform Activity Log'}</CardTitle>
          </CardHeader>
          <div className="p-8 space-y-6">
            {[
              { text: isAr ? 'تم تحديث عمولة المورد "س" بنسبة ٥٪' : 'Supplier Commission updated by 5%', time: '2m' },
              { text: isAr ? 'طلب سحب رصيد جديد من مقاول "ج"' : 'New withdrawal request from Contractor C', time: '15m' },
              { text: isAr ? 'تم حظر مستخدم لمحاولة تلاعب بالأسعار' : 'User banned for price manipulation attempt', time: '1h' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">{log.text}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">{log.time} ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
