
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireOnboarded?: boolean;
}

export function AuthGuard({ children, requireOnboarded = true }: AuthGuardProps) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = user ? doc(db, 'users', user.uid) : null;
  const { data: profile, loading: profileLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (authLoading || (user && profileLoading)) return;

    if (!user) {
      router.push(`/login?redirectTo=${pathname}`);
      return;
    }

    if (requireOnboarded && !profile?.onboarded && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [user, authLoading, profile, profileLoading, router, pathname, requireOnboarded]);

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
