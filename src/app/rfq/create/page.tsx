"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useUser } from '@/firebase';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLanguageContext } from '@/components/LanguageProvider';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { RFQService } from '@/services/rfq.service';

export default function CreateRFQPage() {
  const { lang, isRtl } = useLanguageContext();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: 'renovation',
    location: '',
    budget: '',
    timeline: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const docRef = await RFQService.createRFQ(
        db,
        formData as any,
        user.uid,
        user.displayName || user.email || ''
      );
      
      toast({
        title: isAr ? "تم إنشاء طلبك بنجاح" : "RFQ Created Successfully",
        description: isAr ? "سيتم إشعار الموردين بطلبك قريباً." : "Suppliers will be notified of your request shortly.",
      });
      router.push(`/rfq/${docRef.id}`);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['customer', 'admin']}>
        <div className="min-h-screen bg-muted/20" dir={isRtl ? 'rtl' : 'ltr'}>
          <Header />
          <main className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-primary">
                    {isAr ? 'إنشاء طلب عرض سعر جديد' : 'Create New RFQ'}
                  </h1>
                  <p className="text-muted-foreground">
                    {isAr ? 'أدخل تفاصيل مشروعك للحصول على أفضل العروض' : 'Enter your project details to get the best offers'}
                  </p>
                </div>
              </div>

              <Card className="rounded-[2.5rem] overflow-hidden border-0 shadow-xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>{isAr ? 'اسم المشروع' : 'Project Name'}</Label>
                        <Input 
                          required
                          value={formData.projectName}
                          onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                          placeholder={isAr ? 'مثال: فيلا حي النرجس' : 'e.g. Al-Narjis Villa'}
                          className="rounded-xl h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{isAr ? 'نوع المشروع' : 'Project Type'}</Label>
                        <Select 
                          value={formData.projectType}
                          onValueChange={(v) => setFormData({...formData, projectType: v})}
                        >
                          <SelectTrigger className="rounded-xl h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new_construction">{isAr ? 'بناء جديد' : 'New Construction'}</SelectItem>
                            <SelectItem value="renovation">{isAr ? 'ترميم' : 'Renovation'}</SelectItem>
                            <SelectItem value="furnishing">{isAr ? 'تأثيث' : 'Furnishing'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>{isAr ? 'الموقع' : 'Location'}</Label>
                        <Input 
                          required
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder={isAr ? 'المدينة، الحي' : 'City, District'}
                          className="rounded-xl h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{isAr ? 'الميزانية المتوقعة (ر.س)' : 'Expected Budget (SAR)'}</Label>
                        <Input 
                          type="number"
                          required
                          value={formData.budget}
                          onChange={(e) => setFormData({...formData, budget: e.target.value})}
                          className="rounded-xl h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{isAr ? 'الجدول الزمني (مدة التوصيل المطلوبة)' : 'Timeline (Delivery Deadline)'}</Label>
                      <Input 
                        required
                        value={formData.timeline}
                        onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                        placeholder={isAr ? 'مثال: خلال أسبوعين' : 'e.g. Within 2 weeks'}
                        className="rounded-xl h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{isAr ? 'وصف الاحتياج' : 'Description of Needs'}</Label>
                      <Textarea 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder={isAr ? 'صف المواد أو الخدمات المطلوبة بالتفصيل...' : 'Describe the materials or services needed in detail...'}
                        className="rounded-xl min-h-[150px]"
                      />
                    </div>

                    <div className="pt-4">
                      <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold gap-2" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAr ? 'نشر الطلب' : 'Post RFQ')}
                        {!loading && (isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />)}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </main>
          <Footer />
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}
