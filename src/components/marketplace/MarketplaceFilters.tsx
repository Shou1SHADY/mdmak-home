
"use client";

import { CategorySlug } from '@/types/marketplace';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguageContext } from '@/components/LanguageProvider';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface MarketplaceFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
  categories: { slug: CategorySlug; label: string }[];
}

export function MarketplaceFilters({ filters, setFilters, categories }: MarketplaceFiltersProps) {
  const { lang } = useLanguageContext();
  const isAr = lang === 'ar';

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      minPrice: 0,
      maxPrice: 10000,
      sort: 'newest'
    });
  };

  return (
    <div className="space-y-8 sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">{isAr ? 'الفلاتر' : 'Filters'}</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs text-muted-foreground hover:text-primary">
          <X className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
          {isAr ? 'مسح الكل' : 'Clear All'}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground ltr:left-3 ltr:right-auto" />
          <Input 
            placeholder={isAr ? 'بحث عن منتج...' : 'Search products...'}
            className="pr-10 ltr:pl-10 ltr:pr-4"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="font-bold">{isAr ? 'الفئة' : 'Category'}</Label>
        <Select 
          value={filters.category} 
          onValueChange={(v) => setFilters({ ...filters, category: v })}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isAr ? 'جميع الفئات' : 'All Categories'}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="font-bold">{isAr ? 'السعر' : 'Price'}</Label>
          <span className="text-xs font-bold text-primary">
            {filters.maxPrice} {isAr ? 'ر.س' : 'SAR'}
          </span>
        </div>
        <Slider 
          value={[filters.maxPrice]} 
          max={10000} 
          step={100} 
          onValueChange={(v) => setFilters({ ...filters, maxPrice: v[0] })}
        />
        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold">
          <span>0</span>
          <span>10,000+</span>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="font-bold">{isAr ? 'ترتيب حسب' : 'Sort By'}</Label>
        <Select 
          value={filters.sort} 
          onValueChange={(v) => setFilters({ ...filters, sort: v })}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{isAr ? 'الأحدث' : 'Newest'}</SelectItem>
            <SelectItem value="price_asc">{isAr ? 'السعر: من الأقل' : 'Price: Low to High'}</SelectItem>
            <SelectItem value="price_desc">{isAr ? 'السعر: من الأعلى' : 'Price: High to Low'}</SelectItem>
            <SelectItem value="rating">{isAr ? 'الأعلى تقييماً' : 'Best Rating'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
