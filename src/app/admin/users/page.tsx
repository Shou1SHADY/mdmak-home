
"use client";

import { useState } from 'react';
import { useLanguageContext } from '@/components/LanguageProvider';
import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
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
import { Input } from '@/components/ui/input';
import { Search, ShieldCheck, MoreVertical, UserX, UserCheck, Loader2 } from 'lucide-react';
import { useMemoFirebase } from '@/firebase/firestore/use-doc';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsersPage() {
  const { lang, isRtl } = useLanguageContext();
  const db = useFirestore();
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const [searchTerm, setSearchTerm] = useState('');

  const usersQuery = useMemoFirebase(() => {
    return query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(50));
  }, [db]);

  const { data: users, loading } = useCollection(usersQuery);

  const filteredUsers = (users || []).filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserVerification = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { verified: !currentStatus });
      toast({ title: isAr ? "تم تحديث الحالة" : "Status Updated" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-primary mb-2">
            {isAr ? 'إدارة المستخدمين' : 'User Management'}
          </h1>
          <p className="text-muted-foreground">
            {isAr ? 'التحكم في صلاحيات المستخدمين وتوثيق الحسابات.' : 'Manage user permissions and verify accounts.'}
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground ltr:left-3 ltr:right-auto" />
          <Input 
            placeholder={isAr ? 'بحث عن مستخدم...' : 'Search users...'}
            className="rounded-xl pr-10 ltr:pl-10 ltr:pr-4 bg-white h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="rounded-[2.5rem] overflow-hidden border-0 shadow-xl bg-white">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-bold">{isAr ? 'المستخدم' : 'User'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'البريد الإلكتروني' : 'Email'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'الدور' : 'Role'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'الحالة' : 'Status'}</TableHead>
              <TableHead className="text-right font-bold">{isAr ? 'الإجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <TableRow key={user.uid} className="hover:bg-muted/5 group transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center font-black text-primary">
                      {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="font-bold text-primary">{user.displayName || (isAr ? 'مستخدم غير معروف' : 'Unknown User')}</div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground font-medium">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize px-3 py-1 font-bold">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.verified ? (
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {isAr ? 'موثق' : 'Verified'}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground border-dashed">
                      {isAr ? 'غير موثق' : 'Unverified'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-xl h-10 w-10 p-0 text-primary hover:bg-primary hover:text-white"
                      onClick={() => toggleUserVerification(user.uid, user.verified)}
                    >
                      {user.verified ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-xl h-10 w-10 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                  {isAr ? 'لم يتم العثور على مستخدمين' : 'No users found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
