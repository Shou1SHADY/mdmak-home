
"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { ContractorProfile } from '@/types/contractor';
import { useLanguageContext } from '@/components/LanguageProvider';
import { 
  Loader2, 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ChevronRight,
  Filter,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import Link from 'next/link';
import { useMemoFirebase } from '@/firebase/firestore/use-doc';

export default function ContractorListingPage() {
  const { lang, isRtl } = useLanguageContext();
  const db = useFirestore();
  const isAr = lang === 'ar';

  const [filters, setFilters] = useState({
    search: '',
    city: 'all',
    service: 'all',
  });

  const contractorsQuery = useMemoFirebase(() => {
    let q = collection(db, 'contractors');
    let constraints: any[] = [];
    
    if (filters.city !== 'all') {
      constraints.push(where('city', '==', filters.city));
    }
    
    // Simple ordering
    constraints.push(orderBy('rating', 'desc'));
    
    return query(q, ...constraints, limit(20));
  }, [db, filters.city]);

  const { data: contractors, loading } = useCollection<ContractorProfile>(contractorsQuery);

  const filteredContractors = contractors.filter(c => {
    const matchesSearch = c.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
                        c.services.some(s => s.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesService = filters.service === 'all' || c.services.includes(filters.service);
    return matchesSearch && matchesService;
  });

  const cities = isAr ? ['الرياض', 'جدة', 'الدمام', 'الخبر', 'مكة'] : ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Makkah'];
  const services = isAr 
    ? ['مقاولات عامة', 'سباكة', 'كهرباء', 'دهانات', 'تكييف', 'أرضيات'] 
    : ['General Contracting', 'Plumbing', 'Electrical', 'Painting', 'HVAC', 'Flooring'];

  return (
    <div className="min-h-screen bg-muted/20" dir={isRtl ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-primary">
              {isAr ? 'ابحث عن مقاول محترف' : 'Find Professional Contractors'}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {isAr 
                ? 'اكتشف أفضل الشركات والمقاولين المعتمدين لمشروعك القادم. قارن بين التقييمات والأعمال السابقة.' 
                : 'Discover the best certified companies and contractors for your next project. Compare ratings and past portfolios.'}
            </p>
          </div>
          <Button asChild size="lg" className="rounded-2xl h-14 px-8 shadow-lg shadow-primary/20">
            <Link href="/rfq/create">
              {isAr ? 'اطلب عروض أسعار لمشروعك' : 'Request Quotes for Your Project'}
            </Link>
          </Button>
        </div>

        {/* Filter Bar */}
        <Card className="rounded-[2rem] border-0 shadow-sm mb-12 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative md:col-span-2">
                <Search className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground ltr:left-3 ltr:right-auto" />
                <Input 
                  placeholder={isAr ? 'بحث عن شركة، خدمة، أو نوع تخصص...' : 'Search for company, service, or specialty...'}
                  className="rounded-xl h-12 pr-10 ltr:pl-10 ltr:pr-4"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
              <Select value={filters.city} onValueChange={(v) => setFilters({...filters, city: v})}>
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue placeholder={isAr ? 'المدينة' : 'City'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isAr ? 'جميع المدن' : 'All Cities'}</SelectItem>
                  {cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.service} onValueChange={(v) => setFilters({...filters, service: v})}>
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue placeholder={isAr ? 'الخدمة' : 'Service'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isAr ? 'جميع الخدمات' : 'All Services'}</SelectItem>
                  {services.map(service => <SelectItem key={service} value={service}>{service}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="h-[40vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredContractors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContractors.map((contractor) => (
              <Card key={contractor.id} className="group rounded-[2.5rem] border-0 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-white">
                <div className="relative h-48 bg-primary/5">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Users className="w-32 h-32" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-transparent">
                    <div className="relative w-16 h-16 rounded-2xl bg-white shadow-lg border-2 border-primary/5 flex items-center justify-center overflow-hidden">
                      {contractor.logo ? (
                        <Image src={contractor.logo} alt={contractor.companyName} fill className="object-cover" />
                      ) : (
                        <span className="text-2xl font-black text-primary">{contractor.companyName.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <h3 className="text-xl font-black text-primary line-clamp-1">{contractor.companyName}</h3>
                      {contractor.verified && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-yellow-700">{contractor.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{contractor.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {contractor.services.slice(0, 3).map((service, i) => (
                      <Badge key={i} variant="secondary" className="rounded-full font-medium">
                        {service}
                      </Badge>
                    ))}
                    {contractor.services.length > 3 && (
                      <Badge variant="outline" className="rounded-full">+{contractor.services.length - 3}</Badge>
                    )}
                  </div>

                  <Button asChild className="w-full rounded-2xl h-12 font-bold gap-2">
                    <Link href={`/contractors/${contractor.id}`}>
                      {isAr ? 'عرض الملف الشخصي' : 'View Profile'}
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-[50vh] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] border-2 border-dashed">
            <Users className="w-20 h-20 text-muted-foreground mb-6 opacity-20" />
            <h3 className="text-2xl font-bold mb-2">{isAr ? 'لم يتم العثور على مقاولين' : 'No contractors found'}</h3>
            <p className="text-muted-foreground max-w-sm">
              {isAr 
                ? 'جرب تغيير فلاتر البحث أو ابحث بكلمات مختلفة.' 
                : 'Try changing your search filters or use different keywords.'}
            </p>
            <Button variant="outline" className="mt-8" onClick={() => setFilters({search: '', city: 'all', service: 'all'})}>
              {isAr ? 'إعادة ضبط البحث' : 'Reset Search'}
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
