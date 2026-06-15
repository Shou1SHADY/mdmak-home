
"use client";

import { useLanguageContext } from '@/components/LanguageProvider';
import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where, doc, updateDoc } from 'firebase/firestore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Eye, Loader2, ShieldCheck, Building2 } from 'lucide-react';
import { useMemoFirebase } from '@/firebase/firestore/use-doc';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function AdminApprovalsPage() {
  const { lang } = useLanguageContext();
  const db = useFirestore();
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const approvalsQuery = useMemoFirebase(() => {
    return query(collection(db, 'contractors'), where('verified', '==', false));
  }, [db]);

  const { data: contractors, loading } = useCollection(approvalsQuery);

  const handleApproval = async (contractorId: string, approve: boolean) => {
    try {
      await updateDoc(doc(db, 'contractors', contractorId), { verified: approve });
      toast({ 
        title: approve ? (isAr ? "تم التوثيق بنجاح" : "Verified Successfully") : (isAr ? "تم رفض الطلب" : "Request Denied")
      });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-primary mb-2">
          {isAr ? 'طلبات التوثيق' : 'Verification Requests'}
        </h1>
        <p className="text-muted-foreground">
          {isAr ? 'مراجعة واعتماد ملفات المقاولين والموردين الجدد.' : 'Review and approve new contractor and supplier profiles.'}
        </p>
      </div>

      <Card className="rounded-[2.5rem] overflow-hidden border-0 shadow-xl bg-white">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-bold">{isAr ? 'الشركة' : 'Company'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'الموقع' : 'Location'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'الخدمات' : 'Services'}</TableHead>
              <TableHead className="text-right font-bold">{isAr ? 'الإجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : contractors.length > 0 ? contractors.map((c) => (
              <TableRow key={c.id} className="hover:bg-muted/5 group transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center overflow-hidden border">
                      {c.logo ? <Image src={c.logo} alt={c.companyName} fill className="object-cover" /> : <Building2 className="w-6 h-6 text-primary/40" />}
                    </div>
                    <div>
                      <div className="font-bold text-primary">{c.companyName}</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">{c.city}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground font-medium">{c.location}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {c.services.slice(0, 2).map((s: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-[10px] whitespace-nowrap">{s}</Badge>
                    ))}
                    {c.services.length > 2 && <Badge variant="outline" className="text-[10px]">+{c.services.length - 2}</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost" size="sm" className="rounded-xl h-10 w-10 p-0 hover:bg-emerald-50 hover:text-emerald-600" onClick={() => handleApproval(c.id, true)}>
                      <CheckCircle2 className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-xl h-10 w-10 p-0 hover:bg-red-50 hover:text-red-600" onClick={() => handleApproval(c.id, false)}>
                      <XCircle className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl gap-2 font-bold px-4">
                      <Eye className="w-4 h-4" />
                      {isAr ? 'معاينة' : 'Review'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                  {isAr ? 'لا توجد طلبات توثيق معلقة' : 'No pending verification requests'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
