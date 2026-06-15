
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase/provider';
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Store, Construction, ShieldCheck, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type Role = 'customer' | 'supplier' | 'contractor' | 'admin';

export default function OnboardingPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = user ? doc(db, 'users', user.uid) : null;
  const { data: profile, loading: profileLoading } = useDoc(userDocRef);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (profile?.onboarded) {
      router.push('/');
    }
  }, [user, authLoading, profile, router]);

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        role: selectedRole,
        onboarded: true,
        createdAt: serverTimestamp(),
      }, { merge: true });
      
      toast({
        title: "تم بنجاح!",
        description: "تم إعداد حسابك، مرحباً بك في مدمك هوم.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const roles = [
    { 
      id: 'customer', 
      title: 'عميل (فرد)', 
      desc: 'أبحث عن مواد بناء أو مقاولين لمشروعي الخاص.',
      icon: User,
      color: 'bg-blue-500/10 text-blue-600'
    },
    { 
      id: 'supplier', 
      title: 'مورد مواد', 
      desc: 'أملك متجر مواد بناء وأرغب في بيع المنتجات.',
      icon: Store,
      color: 'bg-orange-500/10 text-orange-600'
    },
    { 
      id: 'contractor', 
      title: 'مقاول / مهني', 
      desc: 'أقدم خدمات بناء وترميم متخصصة.',
      icon: Construction,
      color: 'bg-emerald-500/10 text-emerald-600'
    },
    { 
      id: 'admin', 
      title: 'مسؤول نظام', 
      desc: 'إدارة المنصة والمستخدمين.',
      icon: ShieldCheck,
      color: 'bg-purple-500/10 text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-muted/30 py-20 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">أهلاً بك في مدمك هوم</h1>
          <p className="text-muted-foreground">اختر نوع حسابك لنخصص لك أفضل تجربة ممكنة</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all border-2 ${selectedRole === role.id ? 'border-primary ring-4 ring-primary/10' : 'border-transparent'}`}
                onClick={() => setSelectedRole(role.id as Role)}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role.color}`}>
                    <role.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <CardDescription className="text-xs">{role.desc}</CardDescription>
                  </div>
                  {selectedRole === role.id && (
                    <div className="bg-primary text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="w-full max-w-xs h-14 rounded-2xl font-bold text-lg"
            disabled={!selectedRole || saving}
            onClick={handleRoleSelection}
          >
            {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : "إكمال التسجيل"}
          </Button>
        </div>
      </div>
    </div>
  );
}
