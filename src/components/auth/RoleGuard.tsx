
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('customer' | 'supplier' | 'contractor' | 'admin')[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();

  const userDocRef = user ? doc(db, 'users', user.uid) : null;
  const { data: profile, loading: profileLoading } = useDoc(userDocRef);

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const userRole = profile?.role as any;

  if (!user || !allowedRoles.includes(userRole)) {
    return <>{fallback || <div className="p-8 text-center text-muted-foreground">ليس لديك صلاحية للوصول لهذه الصفحة.</div>}</>;
  }

  return <>{children}</>;
}
