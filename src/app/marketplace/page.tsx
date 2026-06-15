import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { MarketplaceClient } from '@/components/marketplace/MarketplaceClient';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MarketplaceClient />
      <Footer />
    </div>
  );
}
