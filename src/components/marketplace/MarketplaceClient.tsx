"use client";

import { useState } from 'react';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Product, CategorySlug } from '@/types/marketplace';
import { useLanguageContext } from '@/components/LanguageProvider';
import { translations } from '@/lib/translations';
import { Loader2, PackageSearch, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMemoFirebase } from '@/firebase/firestore/use-doc';

export function MarketplaceClient() {
  const { lang, isRtl } = useLanguageContext();
  const t = translations[lang];
  const db = useFirestore();

  const categories: { slug: CategorySlug; label: string }[] = [
    { slug: 'cement', label: t.categories.cement },
    { slug: 'steel', label: t.categories.steel },
    { slug: 'tiles', label: t.categories.tiles },
    { slug: 'paint', label: t.categories.paint },
    { slug: 'plumbing', label: t.categories.plumbing },
    { slug: 'electrical', label: t.categories.electrical },
    { slug: 'lighting', label: lang === 'ar' ? 'الإضاءة' : 'Lighting' },
    { slug: 'doors', label: lang === 'ar' ? 'الأبواب' : 'Doors' },
    { slug: 'windows', label: lang === 'ar' ? 'النوافذ' : 'Windows' },
  ];

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 10000,
    sort: 'newest'
  });

  const productQuery = useMemoFirebase(() => {
    let q = collection(db, 'products');
    let constraints: any[] = [];

    if (filters.category !== 'all') {
      constraints.push(where('category', '==', filters.category));
    }

    if (filters.maxPrice < 10000) {
      constraints.push(where('price', '<=', filters.maxPrice));
    }

    if (filters.sort === 'price_asc') constraints.push(orderBy('price', 'asc'));
    else if (filters.sort === 'price_desc') constraints.push(orderBy('price', 'desc'));
    else constraints.push(orderBy('createdAt', 'desc'));

    return query(q, ...constraints, limit(20));
  }, [db, filters.category, filters.maxPrice, filters.sort]);

  const { data: products, loading } = useCollection<Product>(productQuery);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filters.search.toLowerCase()) || 
    p.supplierName.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <main className="container mx-auto px-4 py-8 lg:py-12" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <MarketplaceFilters 
            filters={filters} 
            setFilters={setFilters} 
            categories={categories} 
          />
        </aside>

        {/* Mobile Filter Trigger */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{isRtl ? 'السوق' : 'Marketplace'}</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                {isRtl ? 'تصفية' : 'Filter'}
              </Button>
            </SheetTrigger>
            <SheetContent side={isRtl ? 'right' : 'left'} className="w-80">
              <MarketplaceFilters 
                filters={filters} 
                setFilters={setFilters} 
                categories={categories} 
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div className="hidden lg:block">
              <h1 className="text-3xl font-black text-primary mb-2">
                {filters.category === 'all' 
                  ? (isRtl ? 'جميع المنتجات' : 'All Products') 
                  : categories.find(c => c.slug === filters.category)?.label}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isRtl ? `تم العثور على ${filteredProducts.length} منتج` : `Found ${filteredProducts.length} products`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-[60vh] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center p-12 bg-muted/20 rounded-[2.5rem] border-2 border-dashed">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <PackageSearch className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">{isRtl ? 'لا توجد منتجات' : 'No products found'}</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mb-6">
                {isRtl 
                  ? 'لم نجد أي منتجات تطابق بحثك أو الفلاتر المختارة. جرب تغيير الإعدادات.' 
                  : 'We couldn\'t find any products matching your search or selected filters. Try changing the settings.'}
              </p>
              <Button variant="outline" onClick={() => setFilters({ ...filters, category: 'all', search: '', maxPrice: 10000 })}>
                {isRtl ? 'إعادة ضبط البحث' : 'Reset Search'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
