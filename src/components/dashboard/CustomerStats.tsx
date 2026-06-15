
"use client";

import { useLanguageContext } from '@/components/LanguageProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingDown, 
  ShoppingCart, 
  ClipboardCheck,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export function CustomerStats() {
  const { lang } = useLanguageContext();
  const isAr = lang === 'ar';

  const stats = [
    {
      title: isAr ? 'إجمالي الإنفاق' : 'Total Spend',
      value: 'SAR 128,400',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: isAr ? 'التوفير المحقق' : 'Savings Achieved',
      value: 'SAR 14,200',
      change: '+5.4%',
      trend: 'up',
      icon: TrendingDown,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: isAr ? 'الطلبات الجارية' : 'Ongoing Orders',
      value: '3',
      change: isAr ? 'مستقرة' : 'Stable',
      trend: 'stable',
      icon: ShoppingCart,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      title: isAr ? 'نسبة قبول العروض' : 'RFQ Win Rate',
      value: '78%',
      change: '-2%',
      trend: 'down',
      icon: ClipboardCheck,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <Card key={idx} className="rounded-[2.2rem] border-0 shadow-sm overflow-hidden bg-white hover:shadow-lg transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <Badge variant="outline" className={`text-[10px] font-black uppercase flex items-center gap-1 ${
                stat.trend === 'up' ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 
                stat.trend === 'down' ? 'text-red-600 border-red-100 bg-red-50' : 
                'text-blue-600 border-blue-100 bg-blue-50'
              }`}>
                {stat.trend === 'up' && <ArrowUpRight className="w-2.5 h-2.5" />}
                {stat.trend === 'down' && <ArrowDownRight className="w-2.5 h-2.5" />}
                {stat.change}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-black text-primary">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
