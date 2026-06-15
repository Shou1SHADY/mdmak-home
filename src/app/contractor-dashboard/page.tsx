
"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useUser } from '@/firebase/auth/use-user';
import { useCollection, useDoc } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where, doc } from 'firebase/firestore';
import { useLanguageContext } from '@/components/LanguageProvider';
import { 
  LayoutDashboard, 
  Briefcase, 
  ClipboardList, 
  Bell,
  Star,
  Users,
  Settings,
  Plus,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RFQList } from '@/components/dashboard/RFQList';
import { ContractorProfile } from '@/types/contractor';
import Link from 'next/link';

export default function ContractorDashboardPage() {
  const { lang, isRtl } = useLanguageContext();
  const { user } = useUser();
  const db = useFirestore();
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState('overview');

  // Contractor Profile Query
  const profileRef = user ? doc(db, 'contractors', user.uid) : null;
  const { data: contractorProfile } = useDoc<ContractorProfile>(profileRef);

  const stats = [
    {
      title: isAr ? 'طلبات نشطة' : 'Active Requests',
      value: '8',
      change: '+2',
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: isAr ? 'عروض مقدمة' : 'Quotes Sent',
      value: '14',
      change: '+5',
      icon: ClipboardList,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      title: isAr ? 'التقييم العام' : 'Overall Rating',
      value: contractorProfile?.rating?.toString() || '4.8',
      change: isAr ? 'ممتاز' : 'Excellent',
      icon: Star,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      title: isAr ? 'مشاهدات الملف' : 'Profile Views',
      value: '1.2k',
      change: '+18%',
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    }
  ];

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['contractor', 'admin']}>
        <div className="min-h-screen bg-muted/20" dir={isRtl ? 'rtl' : 'ltr'}>
          <Header />
          
          <main className="container mx-auto px-4 py-8 lg:py-12">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-black text-primary mb-2">
                  {isAr ? 'لوحة تحكم المقاول' : 'Contractor Dashboard'}
                </h1>
                <p className="text-muted-foreground">
                  {isAr ? `مرحباً بك، ${contractorProfile?.companyName || user?.email}` : `Welcome, ${contractorProfile?.companyName || user?.email}`}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-xl h-12 gap-2 bg-white">
                  <Bell className="w-4 h-4" />
                  <Badge className="bg-primary text-white h-5 w-5 p-0 flex items-center justify-center text-[10px]">2</Badge>
                </Button>
                <Button className="rounded-xl h-12 gap-2 shadow-lg shadow-primary/20" asChild>
                  <Link href={`/contractors/${user?.uid}`}>
                    <Users className="w-4 h-4" />
                    {isAr ? 'معاينة الملف' : 'Preview Profile'}
                  </Link>
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="bg-white/50 border p-1 rounded-2xl h-14">
                <TabsTrigger value="overview" className="rounded-xl px-6 h-full font-bold gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  {isAr ? 'نظرة عامة' : 'Overview'}
                </TabsTrigger>
                <TabsTrigger value="requests" className="rounded-xl px-6 h-full font-bold gap-2">
                  <Briefcase className="w-4 h-4" />
                  {isAr ? 'طلبات المشاريع' : 'Project Requests'}
                </TabsTrigger>
                <TabsTrigger value="messages" className="rounded-xl px-6 h-full font-bold gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {isAr ? 'الرسائل' : 'Messages'}
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-xl px-6 h-full font-bold gap-2">
                  <Settings className="w-4 h-4" />
                  {isAr ? 'الإعدادات' : 'Settings'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, idx) => (
                    <Card key={idx} className="rounded-[2rem] border-0 shadow-sm overflow-hidden bg-white">
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
                  {/* Matching RFQs */}
                  <Card className="lg:col-span-2 rounded-[2.5rem] border-0 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="p-8 border-b flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold">{isAr ? 'مشاريع مقترحة لك' : 'Matched Projects for You'}</CardTitle>
                        <CardDescription>{isAr ? 'بناءً على تخصصك وموقعك' : 'Based on your specialty and location'}</CardDescription>
                      </div>
                      <Button variant="ghost" className="text-primary font-bold" onClick={() => setActiveTab('requests')}>
                        {isAr ? 'عرض الكل' : 'View All'}
                      </Button>
                    </CardHeader>
                    <div className="p-0">
                      <RFQList limitCount={4} compact />
                    </div>
                  </Card>

                  {/* Profile Completion */}
                  <Card className="rounded-[2.5rem] border-0 shadow-sm bg-primary text-white p-8">
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-lg">{isAr ? 'اكتمال الملف الشخصي' : 'Profile Completion'}</h4>
                        <span className="text-accent font-black">85%</span>
                      </div>
                      <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: '85%' }} />
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm text-white/70 leading-relaxed">
                          {isAr 
                            ? 'أضف المزيد من صور المشاريع لزيادة ثقة العملاء بك بنسبة ٤٠٪.' 
                            : 'Add more project photos to increase customer trust by 40%.'}
                        </p>
                        <Button className="w-full bg-white text-primary hover:bg-white/90 font-black rounded-2xl h-12">
                          {isAr ? 'تحديث الملف' : 'Update Profile'}
                        </Button>
                      </div>

                      <div className="pt-8 border-t border-white/10">
                        <h5 className="font-bold text-xs uppercase tracking-widest text-white/50 mb-4">{isAr ? 'نصيحة الأسبوع' : 'Weekly Tip'}</h5>
                        <div className="flex gap-4 items-start">
                          <TrendingUp className="w-5 h-5 text-accent shrink-0" />
                          <p className="text-sm text-white/80 italic">
                            {isAr 
                              ? 'المقاولون الذين يردون في أقل من ٤ ساعات يحصلون على ٥ أضعاف المشاريع.' 
                              : 'Contractors who respond in less than 4 hours win 5x more projects.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="requests">
                <Card className="rounded-[2.5rem] border-0 shadow-sm bg-white overflow-hidden">
                  <CardHeader className="p-8 border-b">
                    <CardTitle className="text-xl font-bold">{isAr ? 'إدارة طلبات المشاريع' : 'Manage Project Requests'}</CardTitle>
                  </CardHeader>
                  <RFQList />
                </Card>
              </TabsContent>
            </Tabs>
          </main>
          
          <Footer />
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}
