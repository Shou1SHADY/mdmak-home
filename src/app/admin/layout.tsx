
"use client";

import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useLanguageContext } from '@/components/LanguageProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isRtl } = useLanguageContext();

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin']}>
        <div className="min-h-screen bg-muted/20" dir={isRtl ? 'rtl' : 'ltr'}>
          <Header />
          <div className="flex container mx-auto px-4">
            <AdminSidebar />
            <main className="flex-1 py-8 lg:py-12 lg:px-8">
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}
