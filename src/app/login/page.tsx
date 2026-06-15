
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/provider';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FirebaseError } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/onboarding');
    } catch (error: any) {
      const message = error instanceof FirebaseError ? error.message : "حدث خطأ غير متوقع";
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/onboarding');
    } catch (error: any) {
      // Don't show error if user closed the popup
      if (error.code !== 'auth/popup-closed-by-user') {
        const message = error instanceof FirebaseError ? error.message : "فشل تسجيل الدخول عبر جوجل";
        toast({
          variant: "destructive",
          title: "خطأ في تسجيل الدخول",
          description: message,
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4" dir="rtl">
      <Card className="w-full max-w-md border-0 shadow-xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="space-y-1 text-center pb-8 pt-10">
          <CardTitle className="text-3xl font-black text-primary">تسجيل الدخول</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">أدخل بريدك الإلكتروني للوصول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-primary mr-1">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pr-10 h-12 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-bold text-primary mr-1">كلمة المرور</Label>
                <Link href="/forgot-password" size="sm" className="text-xs text-primary font-bold hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pr-10 h-12 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl font-black text-lg shadow-lg shadow-primary/20" disabled={loading || googleLoading}>
              {loading ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <LogIn className="ml-2 h-5 w-5" />}
              تسجيل الدخول
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground font-bold">أو استمر عبر</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            type="button" 
            className="w-full h-12 rounded-xl font-bold border-2 hover:bg-muted/50" 
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            ) : (
              <svg className="ml-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
            )}
            جوجل
          </Button>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-2 pb-10 bg-muted/20">
          <div className="text-sm text-muted-foreground font-medium">
            ليس لديك حساب؟
          </div>
          <Link href="/register" className="text-sm font-black text-primary hover:underline">
            سجل الآن مجاناً
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
