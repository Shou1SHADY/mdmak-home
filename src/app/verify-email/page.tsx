
"use client";

import { useUser } from '@/firebase/auth/use-user';
import { useAuth } from '@/firebase/provider';
import { sendEmailVerification } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: "تم الإرسال!",
        description: "تم إرسال رابط تأكيد جديد إلى بريدك الإلكتروني.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4" dir="rtl">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Mail className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">تأكيد البريد الإلكتروني</CardTitle>
          <CardDescription>
            لقد أرسلنا رابط تأكيد إلى: <br/>
            <span className="font-bold text-foreground">{user?.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            يرجى النقر على الرابط الموجود في البريد الإلكتروني لتفعيل حسابك والبدء في استخدام مدمك هوم.
          </p>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleResend}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
            إعادة إرسال البريد
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
           <Link href="/login" className="flex items-center gap-2 text-sm text-primary hover:underline">
            العودة لتسجيل الدخول
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
