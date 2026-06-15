
"use client";

import { useLanguageContext } from '@/components/LanguageProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Eye, MoreHorizontal, Clock, CheckCircle2, Package } from 'lucide-react';

export function OrderList() {
  const { lang, isRtl } = useLanguageContext();
  const isAr = lang === 'ar';

  // Mock Orders for UI
  const orders = [
    {
      id: 'ORD-7231',
      customer: 'Ahmed Al-Fahd',
      date: '2024-05-12',
      total: 12500,
      status: 'shipped',
      items: 3
    },
    {
      id: 'ORD-7232',
      customer: 'Coastal Builders KSA',
      date: '2024-05-14',
      total: 8400,
      status: 'pending',
      items: 1
    },
    {
      id: 'ORD-7235',
      customer: 'Modern Homes Co.',
      date: '2024-05-15',
      total: 32000,
      status: 'delivered',
      items: 8
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <Badge className="bg-orange-500 text-white border-0">{isAr ? 'قيد الانتظار' : 'Pending'}</Badge>;
      case 'shipped': return <Badge className="bg-blue-500 text-white border-0">{isAr ? 'تم الشحن' : 'Shipped'}</Badge>;
      case 'delivered': return <Badge className="bg-emerald-500 text-white border-0">{isAr ? 'تم التوصيل' : 'Delivered'}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="rounded-[2.5rem] border-0 shadow-sm bg-white overflow-hidden">
      <CardHeader className="p-8 border-b">
        <CardTitle className="text-xl font-bold">{isAr ? 'إدارة الطلبات' : 'Order Management'}</CardTitle>
        <CardDescription>{isAr ? 'تتبع حالة طلبات عملائك' : 'Track the status of your customer orders'}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-bold">{isAr ? 'رقم الطلب' : 'Order ID'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'العميل' : 'Customer'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'التاريخ' : 'Date'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'المجموع' : 'Total'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'الحالة' : 'Status'}</TableHead>
              <TableHead className="text-right font-bold">{isAr ? 'الإجراء' : 'Action'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/5 group">
                <TableCell className="font-black text-primary">{order.id}</TableCell>
                <TableCell>
                  <div className="font-bold">{order.customer}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">{order.items} {isAr ? 'منتجات' : 'Items'}</div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
                <TableCell className="font-black">{order.total.toLocaleString()} SAR</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="rounded-xl gap-2 font-bold group-hover:bg-primary group-hover:text-white transition-all">
                    <Eye className="w-4 h-4" />
                    {isAr ? 'تفاصيل' : 'Details'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p>{isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
