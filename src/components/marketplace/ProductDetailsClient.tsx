"use client";

import { useState, useEffect } from 'react';
import { useDoc, useCollection } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc, collection, query, where, limit } from 'firebase/firestore';
import { Product } from '@/types/marketplace';
import { useLanguageContext } from '@/components/LanguageProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Star, 
  ShoppingCart, 
  Scale, 
  ShieldCheck, 
  MapPin, 
  Share2, 
  Heart, 
  MessageSquare, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  FileText
} from 'lucide-react';
import Image from 'next/image';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { useMemoFirebase } from '@/firebase/firestore/use-doc';

interface ProductDetailsClientProps {
  productId: string;
}

export function ProductDetailsClient({ productId }: ProductDetailsClientProps) {
  const { lang, isRtl } = useLanguageContext();
  const db = useFirestore();
  const isAr = lang === 'ar';

  const productRef = useMemoFirebase(() => doc(db, 'products', productId), [db, productId]);
  const { data: product, loading } = useDoc<Product>(productRef);

  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl);
    }
  }, [product]);

  const relatedQuery = useMemoFirebase(() => {
    if (!product) return null;
    return query(
      collection(db, 'products'),
      where('category', '==', product.category),
      where('id', '!=', productId),
      limit(4)
    );
  }, [db, product, productId]);

  const { data: relatedProducts } = useCollection<Product>(relatedQuery);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">{isAr ? 'المنتج غير موجود' : 'Product Not Found'}</h2>
        <Button asChild>
          <a href="/marketplace">{isAr ? 'العودة للسوق' : 'Back to Marketplace'}</a>
        </Button>
      </div>
    );
  }

  const allImages = [product.imageUrl, ...(product.images || [])];

  return (
    <main className="container mx-auto px-4 py-8 lg:py-12" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
        <a href="/marketplace" className="hover:text-primary transition-colors">{isAr ? 'السوق' : 'Marketplace'}</a>
        <ChevronRight className="w-3 h-3 rtl:rotate-180" />
        <a href={`/marketplace/category/${product.category}`} className="hover:text-primary transition-colors capitalize">{product.category}</a>
        <ChevronRight className="w-3 h-3 rtl:rotate-180" />
        <span className="text-primary font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Gallery Section */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-muted/20 border shadow-sm">
            <Image 
              src={activeImage || product.imageUrl} 
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === img ? 'border-primary ring-2 ring-primary/10' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider">
                {product.category}
              </Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-primary leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-yellow-700">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">{product.reviewsCount || 0} {isAr ? 'مراجعة' : 'Reviews'}</span>
              <div className="h-4 w-px bg-muted mx-2" />
              <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                {product.stock > 0 ? (isAr ? 'متوفر في المخزون' : 'In Stock') : (isAr ? 'نفذت الكمية' : 'Out of Stock')}
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-3xl space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-primary">{product.price.toLocaleString()}</span>
                <span className="text-lg font-bold text-muted-foreground">{isAr ? 'ر.س' : 'SAR'}</span>
                {product.stock < 10 && product.stock > 0 && (
                  <span className="text-xs text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-full ml-auto">
                    {isAr ? `بقي ${product.stock} فقط` : `Only ${product.stock} left`}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button size="lg" className="h-14 rounded-2xl text-md font-bold gap-2 flex-1">
                <ShoppingCart className="w-5 h-5" />
                {isAr ? 'أضف للسلة' : 'Add to Cart'}
              </Button>
              <Button variant="outline" size="lg" className="h-14 rounded-2xl text-md font-bold gap-2 border-primary/20 hover:bg-primary/5">
                <Scale className="w-5 h-5" />
                {isAr ? 'مقارنة' : 'Compare'}
              </Button>
            </div>

            <Button variant="secondary" size="lg" className="w-full h-14 rounded-2xl text-md font-bold gap-2 shadow-sm">
              <FileText className="w-5 h-5" />
              {isAr ? 'طلب عرض سعر خاص' : 'Request Custom Quote'}
            </Button>
          </div>

          {/* Supplier Card */}
          <Card className="rounded-[2rem] overflow-hidden border-2 border-primary/5 shadow-none bg-muted/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-primary">
                    {product.supplierName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-primary">{product.supplierName}</h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{product.supplierLocation || (isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia')}</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100">
                  {isAr ? 'موثوق' : 'Verified'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{isAr ? 'التقييم' : 'Rating'}</p>
                  <p className="text-sm font-black text-primary">4.8/5</p>
                </div>
                <div className="text-center border-x">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{isAr ? 'سرعة التوصيل' : 'Delivery'}</p>
                  <p className="text-sm font-black text-primary">{product.deliveryScore || 95}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{isAr ? 'الاستجابة' : 'Response'}</p>
                  <p className="text-sm font-black text-primary">{isAr ? 'سريع' : 'Fast'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Tabs */}
      <div className="mt-20">
        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="w-full justify-start h-14 bg-transparent border-b rounded-none p-0 gap-8">
            <TabsTrigger 
              value="specifications" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full px-4 font-bold text-md"
            >
              {isAr ? 'المواصفات الفنية' : 'Technical Specifications'}
            </TabsTrigger>
            <TabsTrigger 
              value="description" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full px-4 font-bold text-md"
            >
              {isAr ? 'الوصف التفصيلي' : 'Full Description'}
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full px-4 font-bold text-md"
            >
              {isAr ? 'المراجعات' : 'Reviews'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="specifications" className="py-8">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
              {product.specifications ? Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-4 border-b">
                  <span className="text-muted-foreground font-medium">{key}</span>
                  <span className="font-bold text-primary">{value}</span>
                </div>
              )) : (
                <p className="text-muted-foreground">{isAr ? 'لا توجد مواصفات فنية متاحة' : 'No technical specifications available'}</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="description" className="py-8">
            <div className="prose prose-primary max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="py-8">
            <div className="flex flex-col items-center justify-center p-12 bg-muted/10 rounded-3xl border-2 border-dashed">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-bold mb-2">{isAr ? 'لا توجد مراجعات بعد' : 'No reviews yet'}</h3>
              <p className="text-sm text-muted-foreground">{isAr ? 'كن أول من يقيم هذا المنتج' : 'Be the first to review this product'}</p>
              <Button variant="outline" className="mt-6 rounded-full">{isAr ? 'اكتب مراجعة' : 'Write a Review'}</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="text-2xl font-black text-primary mb-8">{isAr ? 'منتجات مشابهة قد تعجبك' : 'Related Products You Might Like'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
