"use client";

import { useState } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from '@/firebase';
import { useLanguageContext } from '@/components/LanguageProvider';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Product, CategorySlug } from '@/types/marketplace';
import { Edit, Trash2, Plus, Loader2, Package, Search, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useMemoFirebase } from '@/firebase/firestore/use-doc';
import { ProductService } from '@/services/product.service';

export function ProductManager() {
  const { user } = useUser();
  const db = useFirestore();
  const { lang } = useLanguageContext();
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'cement' as CategorySlug,
    stock: '',
    deliveryEstimate: '',
    imageUrl: 'https://picsum.photos/seed/product/600/400'
  });

  const productsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'products'), where('supplierId', '==', user.uid));
  }, [db, user]);

  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        deliveryEstimate: product.deliveryEstimate,
        imageUrl: product.imageUrl
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'cement',
        stock: '',
        deliveryEstimate: '',
        imageUrl: 'https://picsum.photos/seed/product/600/400'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      await ProductService.saveProduct(
        db,
        formData,
        user.uid,
        user.displayName || user.email || 'Supplier',
        editingProduct?.id
      );
      
      toast({ title: editingProduct ? (isAr ? "تم تحديث المنتج" : "Product Updated") : (isAr ? "تم إضافة المنتج" : "Product Added") });
      setIsModalOpen(false);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) return;
    try {
      await ProductService.deleteProduct(db, productId);
      toast({ title: isAr ? "تم حذف المنتج" : "Product Deleted" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground ltr:left-3 ltr:right-auto" />
          <Input 
            placeholder={isAr ? 'بحث في منتجاتك...' : 'Search your products...'}
            className="rounded-xl pr-10 ltr:pl-10 ltr:pr-4 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-xl h-12 w-full md:w-auto gap-2">
          <Plus className="w-4 h-4" />
          {isAr ? 'منتج جديد' : 'New Product'}
        </Button>
      </div>

      <div className="rounded-[2.5rem] bg-white shadow-sm overflow-hidden border">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[100px]">{isAr ? 'الصورة' : 'Image'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'اسم المنتج' : 'Name'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'الفئة' : 'Category'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'السعر' : 'Price'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'المخزون' : 'Stock'}</TableHead>
              <TableHead className="text-right font-bold">{isAr ? 'الإجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredProducts.length > 0 ? filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/5">
                <TableCell>
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border bg-muted">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-primary">{product.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">{product.category}</Badge>
                </TableCell>
                <TableCell className="font-black">
                  {product.price.toLocaleString()} SAR
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold">{product.stock}</span>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${product.stock < 10 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min(product.stock, 100)}%` }} 
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleOpenModal(product)}>
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  {isAr ? 'لا توجد منتجات مطابقة لبحثك' : 'No products found matching your search'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-0">
          <DialogHeader className="p-8 bg-primary text-white">
            <DialogTitle className="text-2xl font-black">
              {editingProduct ? (isAr ? 'تعديل المنتج' : 'Edit Product') : (isAr ? 'إضافة منتج جديد' : 'Add New Product')}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {isAr ? 'أدخل تفاصيل المنتج ليتم عرضه في السوق' : 'Enter product details to list it in the marketplace'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>{isAr ? 'اسم المنتج' : 'Product Name'}</Label>
                <Input 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>{isAr ? 'الفئة' : 'Category'}</Label>
                <Select value={formData.category} onValueChange={(v: any) => setFormData({...formData, category: v})}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['cement', 'steel', 'tiles', 'paint', 'plumbing', 'electrical', 'lighting', 'doors', 'windows'].map(c => (
                      <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{isAr ? 'وصف المنتج' : 'Product Description'}</Label>
              <Textarea 
                required 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="rounded-xl min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>{isAr ? 'السعر (ر.س)' : 'Price (SAR)'}</Label>
                <Input 
                  type="number" 
                  required 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>{isAr ? 'المخزون المتوفر' : 'Stock Quantity'}</Label>
                <Input 
                  type="number" 
                  required 
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>{isAr ? 'مدة التوصيل' : 'Delivery Estimate'}</Label>
                <Input 
                  required 
                  placeholder={isAr ? 'مثال: ٢-٣ أيام' : 'e.g. 2-3 days'}
                  value={formData.deliveryEstimate}
                  onChange={(e) => setFormData({...formData, deliveryEstimate: e.target.value})}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{isAr ? 'رابط الصورة' : 'Image URL'}</Label>
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-2xl bg-muted border flex items-center justify-center shrink-0">
                  {formData.imageUrl ? <Image src={formData.imageUrl} alt="preview" fill className="object-cover rounded-2xl" /> : <ImageIcon className="w-8 h-8 opacity-20" />}
                </div>
                <Input 
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="rounded-xl h-24"
                  placeholder="https://..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl">
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" disabled={loading} className="rounded-xl px-8 h-12 shadow-lg shadow-primary/20">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isAr ? 'حفظ المنتج' : 'Save Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
