
"use client";

import { useUser } from '@/firebase/auth/use-user';
import { useAuth, useFirestore } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, LayoutDashboard, ShieldAlert } from "lucide-react";
import { useLanguageContext } from '@/components/LanguageProvider';

export function UserNav() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { lang } = useLanguageContext();
  const isAr = lang === 'ar';

  const userDocRef = user ? doc(db, 'users', user.uid) : null;
  const { data: profile } = useDoc(userDocRef);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const getDashboardPath = () => {
    if (profile?.role === 'admin') return '/admin';
    if (profile?.role === 'supplier') return '/dashboard';
    if (profile?.role === 'contractor') return '/contractor-dashboard';
    if (profile?.role === 'customer') return '/customer-dashboard';
    return '/dashboard';
  };

  if (!user) return null;

  const initials = user.email?.substring(0, 2).toUpperCase() || 'U';
  const isAdmin = profile?.role === 'admin';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
            <AvatarFallback className="bg-primary/5 text-primary font-bold">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount dir={isAr ? 'rtl' : 'ltr'}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || profile?.displayName || (isAr ? 'مستخدم' : 'User')}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-accent mt-1">
              {profile?.role === 'customer' ? (isAr ? 'عميل' : 'Customer') : 
               profile?.role === 'supplier' ? (isAr ? 'مورد' : 'Supplier') : 
               profile?.role === 'contractor' ? (isAr ? 'مقاول' : 'Contractor') : 
               profile?.role === 'admin' ? (isAr ? 'مدير' : 'Admin') : ''}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isAdmin && (
          <DropdownMenuItem onClick={() => router.push('/admin')} className="text-primary font-bold">
            <ShieldAlert className={`${isAr ? 'ml-2' : 'mr-2'} h-4 w-4`} />
            <span>{isAr ? 'لوحة الإدارة' : 'Admin Panel'}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => router.push(getDashboardPath())}>
          <LayoutDashboard className={`${isAr ? 'ml-2' : 'mr-2'} h-4 w-4`} />
          <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <User className={`${isAr ? 'ml-2' : 'mr-2'} h-4 w-4`} />
          <span>{isAr ? 'الملف الشخصي' : 'Profile'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className={`${isAr ? 'ml-2' : 'mr-2'} h-4 w-4`} />
          <span>{isAr ? 'الإعدادات' : 'Settings'}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className={`${isAr ? 'ml-2' : 'mr-2'} h-4 w-4`} />
          <span>{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
