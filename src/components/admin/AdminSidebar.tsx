
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguageContext } from '@/components/LanguageProvider';
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  ShoppingCart,
  ShieldCheck,
  Settings,
  BarChart3,
  FileText
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const { lang } = useLanguageContext();
  const isAr = lang === 'ar';

  const menuItems = [
    {
      title: isAr ? 'لوحة القيادة' : 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: isAr ? 'المستخدمين' : 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: isAr ? 'طلبات التوثيق' : 'Approvals',
      href: '/admin/approvals',
      icon: ShieldCheck,
    },
    {
      title: isAr ? 'المنتجات' : 'Products',
      href: '/admin/products',
      icon: Package,
    },
    {
      title: isAr ? 'المناقصات (RFQ)' : 'RFQs',
      href: '/admin/rfqs',
      icon: ClipboardList,
    },
    {
      title: isAr ? 'الطلبات' : 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      title: isAr ? 'التقارير' : 'Reports',
      href: '/admin/reports',
      icon: BarChart3,
    },
  ];

  return (
    <div className="w-64 bg-white border-e h-[calc(100vh-5rem)] sticky top-20 hidden lg:flex flex-col">
      <div className="p-6 space-y-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-4">
          {isAr ? 'الإدارة العامة' : 'MAIN ADMINISTRATION'}
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-primary"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto p-6 border-t">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted/50 transition-all"
        >
          <Settings className="w-4 h-4" />
          {isAr ? 'إعدادات النظام' : 'System Settings'}
        </Link>
      </div>
    </div>
  );
}
