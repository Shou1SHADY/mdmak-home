export type RFQStatus = 'open' | 'closed' | 'completed';
export type QuotationStatus = 'pending' | 'accepted' | 'rejected';

export interface RFQ {
  id: string;
  customerId: string;
  customerName: string;
  projectName: string;
  projectType: string;
  location: string;
  budget: number;
  timeline: string;
  description: string;
  status: RFQStatus;
  createdAt: any;
}

export interface Quotation {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  price: number;
  deliveryTime: string;
  notes: string;
  status: QuotationStatus;
  createdAt: any;
}