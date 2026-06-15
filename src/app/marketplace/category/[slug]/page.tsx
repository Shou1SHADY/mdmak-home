
"use client";

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MarketplacePage from '../../page';
import { CategorySlug } from '@/types/marketplace';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = use(params);
  
  // This page simply wraps the main marketplace page but could potentially pass initial filters.
  // For a clean implementation, we could update the MarketplacePage state based on this slug.
  
  return <MarketplacePage />;
}
