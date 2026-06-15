
"use client";

import { useLanguageContext } from '@/components/LanguageProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Users, 
  Package, 
  TrendingUp, 
  ArrowUpRight,
  ClipboardList
} from 'lucide-react';

export function AdminStats() {
  const { lang } = useLanguageContext();
  const isAr = lang === 'ar';

  const stats = [
    {
      title: isAr ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: 'SAR 1.2M',
      change: '+15.2%',
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: isAr ? 'المستخدمين النشطين' : 'Active Users',
      value: '2,840',
      change: '+8.4%',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: isAr ? 'إجمالي المناقصات' : 'Total RFQs',
      value: '452',
      change: '+12.1%',
      icon: ClipboardList,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      title: isAr ? 'الطلبات المكتملة' : 'Orders Completed',
      value: '1,120',
      change: '+22.5%',
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <Card key={idx} className="rounded-[2.2rem] border-0 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <Badge variant="outline" className="text-[10px] font-black uppercase text-emerald-600 border-emerald-100 bg-emerald-50 gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-black text-primary">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
