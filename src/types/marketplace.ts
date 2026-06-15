
export type CategorySlug = 
  | 'cement' 
  | 'steel' 
  | 'tiles' 
  | 'paint' 
  | 'plumbing' 
  | 'electrical' 
  | 'lighting' 
  | 'doors' 
  | 'windows';

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  category: CategorySlug;
  supplierId: string;
  supplierName: string;
  supplierLocation?: string;
  deliveryScore?: number;
  imageUrl: string;
  images?: string[];
  rating: number;
  reviewsCount?: number;
  deliveryEstimate: string;
  stock: number;
  specifications?: Record<string, string>;
  createdAt?: any;
}

export interface MarketplaceFilters {
  search?: string;
  category?: CategorySlug;
  minPrice?: number;
  maxPrice?: number;
  supplier?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}
