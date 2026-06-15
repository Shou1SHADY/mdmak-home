import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { ProductDetailsClient } from '@/components/marketplace/ProductDetailsClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductDetailsClient productId={id} />
      <Footer />
    </div>
  );
}
