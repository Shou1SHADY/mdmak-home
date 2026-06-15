/**
 * @fileOverview Quotation Service - Handles supplier bids and customer approvals.
 */

import { Firestore, collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { Quotation, QuotationStatus } from '@/types/rfq';

export const QuotationService = {
  async submitQuotation(
    db: Firestore,
    rfqId: string,
    data: { price: number; deliveryTime: string; notes: string },
    supplierId: string,
    supplierName: string
  ) {
    const quotesRef = collection(db, 'rfqs', rfqId, 'quotations');
    return addDoc(quotesRef, {
      ...data,
      rfqId,
      supplierId,
      supplierName,
      status: 'pending' as QuotationStatus,
      createdAt: serverTimestamp(),
    });
  },

  async updateStatus(db: Firestore, rfqId: string, quoteId: string, status: QuotationStatus) {
    const quoteRef = doc(db, 'rfqs', rfqId, 'quotations', quoteId);
    return updateDoc(quoteRef, { status });
  }
};
