/**
 * @fileOverview RFQ Service - Manages the lifecycle of project requests.
 */

import { Firestore, collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { RFQ, RFQStatus } from '@/types/rfq';

export const RFQService = {
  async createRFQ(
    db: Firestore, 
    data: Omit<RFQ, 'id' | 'status' | 'createdAt'>,
    userId: string,
    userName: string
  ) {
    const rfqRef = collection(db, 'rfqs');
    return addDoc(rfqRef, {
      ...data,
      budget: Number(data.budget),
      customerId: userId,
      customerName: userName,
      status: 'open' as RFQStatus,
      createdAt: serverTimestamp(),
    });
  },

  async updateStatus(db: Firestore, rfqId: string, status: RFQStatus) {
    const rfqRef = doc(db, 'rfqs', rfqId);
    return updateDoc(rfqRef, { status });
  }
};
