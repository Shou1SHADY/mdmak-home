
export interface PortfolioItem {
  title: string;
  imageUrl: string;
}

export interface ContractorProfile {
  id: string;
  companyName: string;
  logo: string;
  description: string;
  services: string[];
  rating: number;
  reviewsCount: number;
  location: string;
  city: string;
  portfolio: PortfolioItem[];
  certifications: string[];
  verified: boolean;
  createdAt?: any;
}

export type ContractorServiceType = 
  | 'General Contracting' 
  | 'Plumbing' 
  | 'Electrical' 
  | 'Painting' 
  | 'HVAC' 
  | 'Flooring' 
  | 'Roofing' 
  | 'Interior Design';

export interface ContractorFilters {
  search?: string;
  city?: string;
  serviceType?: string;
  minRating?: number;
}
