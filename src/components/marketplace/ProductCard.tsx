
"use client";

import { Product } from '@/types/marketplace';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Truck, ShoppingCart, Scale, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguageContext } from '@/components/LanguageProvider';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { lang } = useLanguageContext();
  const isAr = lang === 'ar';

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300">
      <Link href={`/marketplace/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <Image 
          src={product.imageUrl} 
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-3 left-3 bg-white/90 text-primary hover:bg-white ltr:left-3 ltr:right-auto rtl:right-3 rtl:left-auto">
          {product.category}
        </Badge>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <div className="bg-white text-primary rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
             <Eye className="w-5 h-5" />
           </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-muted-foreground font-medium">{product.supplierName}</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold">{product.rating}</span>
          </div>
        </div>
        <Link href={`/marketplace/product/${product.id}`}>
          <h3 className="font-bold text-primary mb-2 line-clamp-1 hover:text-accent transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Truck className="w-3 h-3" />
          <span>{isAr ? 'توصيل خلال: ' : 'Delivery: '}{product.deliveryEstimate}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-primary">{product.price.toLocaleString()}</span>
          <span className="text-xs font-bold text-muted-foreground">{isAr ? 'ر.س' : 'SAR'}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button variant="outline" size="sm" className="flex-1 rounded-full text-xs gap-1 border-primary/10">
          <Scale className="w-3 h-3" />
          {isAr ? 'قارن' : 'Compare'}
        </Button>
        <Button size="sm" className="flex-1 rounded-full text-xs gap-1">
          <ShoppingCart className="w-3 h-3" />
          {isAr ? 'أضف' : 'Add'}
        </Button>
      </CardFooter>
    </Card>
  );
}
