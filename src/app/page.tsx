"use client";

import { LanguageProvider } from '@/components/LanguageProvider';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { Categories } from '@/components/sections/Categories';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { CostEstimator } from '@/components/sections/CostEstimator';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-background selection:bg-accent selection:text-primary">
        <Header />
        <Hero />
        <Categories />
        <HowItWorks />
        <CostEstimator />
        <CTASection />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
