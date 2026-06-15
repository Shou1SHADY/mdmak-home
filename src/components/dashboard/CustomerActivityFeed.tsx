
"use client";

import { useLanguageContext } from '@/components/LanguageProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Package, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export function CustomerActivityFeed() {
  const { lang, isRtl } = useLanguageContext();
  const isAr = lang === 'ar';

  const activities = [
    {
      id: 1,
      type: 'rfq',
      title: isAr ? 'عرض سعر جديد مستلم' : 'New Quote Received',
      desc: isAr ? 'استلمت عرضاً من "مورد مدمك" لمشروع الفيلا.' : 'Received a quote from "MDMAK Supplier" for Villa Project.',
      time: isAr ? 'منذ ساعتين' : '2 hours ago',
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      id: 2,
      type: 'order',
      title: isAr ? 'تم شحن الطلب' : 'Order Shipped',
      desc: isAr ? 'طلبك رقم #ORD-7231 في الطريق إليك.' : 'Your order #ORD-7231 is on the way.',
      time: isAr ? 'منذ ٥ ساعات' : '5 hours ago',
      icon: Package,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      id: 3,
      type: 'message',
      title: isAr ? 'رسالة من المقاول' : 'Message from Contractor',
      desc: isAr ? 'أرسل المقاول رداً على استفسارك الأخير.' : 'The contractor sent a reply to your recent inquiry.',
      time: isAr ? 'منذ يوم' : 'Yesterday',
      icon: MessageSquare,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      id: 4,
      type: 'system',
      title: isAr ? 'اكتمال الدفعة' : 'Payment Completed',
      desc: isAr ? 'تم تأكيد دفع مبلغ ٤,٥٠٠ ر.س بنجاح.' : 'Payment of SAR 4,500 has been confirmed.',
      time: isAr ? 'منذ يومين' : '2 days ago',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    }
  ];

  return (
    <Card className="rounded-[2.5rem] border-0 shadow-sm bg-white overflow-hidden">
      <CardHeader className="p-8 border-b">
        <CardTitle className="text-xl font-bold">{isAr ? 'النشاط الأخير' : 'Recent Activity'}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {activities.map((item) => (
            <div key={item.id} className="p-6 hover:bg-muted/5 transition-colors flex gap-4">
              <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between w-full">
                  <h5 className="font-bold text-sm text-primary">{item.title}</h5>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">{item.time}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 border-t text-center">
          <Button variant="ghost" className="text-primary font-bold text-xs gap-2 group">
            {isAr ? 'مشاهدة السجل الكامل' : 'View Full History'}
            <ArrowRight className={`w-3 h-3 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
