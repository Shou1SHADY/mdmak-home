
"use client";

import { useMemoFirebase } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useLanguageContext } from '@/components/LanguageProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ClipboardList, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { RFQ } from '@/types/rfq';

interface RFQListProps {
  limitCount?: number;
  compact?: boolean;
}

export function RFQList({ limitCount, compact }: RFQListProps) {
  const { lang, isRtl } = useLanguageContext();
  const db = useFirestore();
  const isAr = lang === 'ar';

  const rfqsQuery = useMemoFirebase(() => {
    let q = query(
      collection(db, 'rfqs'),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );
    if (limitCount) q = query(q, limit(limitCount));
    return q;
  }, [db, limitCount]);

  const { data: rfqs, loading } = useCollection<RFQ>(rfqsQuery);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  if (rfqs.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-10" />
        <p>{isAr ? 'لا توجد طلبات عروض أسعار متاحة حالياً' : 'No RFQ opportunities available at the moment'}</p>
      </div>
    );
  }

  return (
    <div className={compact ? "divide-y" : "p-8 space-y-4"}>
      {rfqs.map((rfq) => (
        <div key={rfq.id} className={`${compact ? "p-6 hover:bg-muted/5" : "p-6 bg-white border rounded-[2rem] hover:shadow-md"} transition-all group`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full bg-muted/30 text-xs font-bold uppercase">
                  {rfq.projectType}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(rfq.createdAt?.seconds * 1000).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-black text-primary group-hover:text-accent transition-colors">
                {rfq.projectName}
              </h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" />
                  {rfq.location}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-primary font-bold">{rfq.budget.toLocaleString()} SAR</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild className="rounded-xl h-12 gap-2 shadow-sm group-hover:shadow-primary/20">
                <Link href={`/rfq/${rfq.id}`}>
                  {isAr ? 'عرض التفاصيل' : 'View Details'}
                  {isRtl ? <ChevronRight className="w-4 h-4 rotate-180" /> : <ChevronRight className="w-4 h-4" />}
                </Link>
              </Button>
            </div>
          </div>
          
          {!compact && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {rfq.description}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
