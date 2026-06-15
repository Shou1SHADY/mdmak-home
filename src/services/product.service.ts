/**
 * @fileOverview Product Service - CRUD operations for construction materials.
 */

import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Product } from '@/types/marketplace';

export const ProductService = {
  async saveProduct(
    db: Firestore,
    data: any,
    supplierId: string,
    supplierName: string,
    productId?: string
  ) {
    const productData = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      supplierId,
      supplierName,
      updatedAt: serverTimestamp(),
    };

    if (productId) {
      return updateDoc(doc(db, 'products', productId), productData);
    } else {
      return addDoc(collection(db, 'products'), {
        ...productData,
        rating: 4.5,
        reviewsCount: 0,
        createdAt: serverTimestamp(),
      });
    }
  },

  async deleteProduct(db: Firestore, productId: string) {
    return deleteDoc(doc(db, 'products', productId));
  }
};
