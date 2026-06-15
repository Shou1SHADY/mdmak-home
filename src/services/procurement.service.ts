/**
 * @fileOverview Procurement Service - Handles scoring, recommendations, and savings analytics.
 */

import { SupplierOffer } from '@/types/marketplace';
import { Quotation } from '@/types/rfq';

export interface ProcurementMetrics {
  procurementScore: number;
  savings: number;
  isBestValue: boolean;
}

export const ProcurementService = {
  /**
   * Calculates a weighted score based on price, quality, and delivery speed.
   * Rating: 40%, Price: 40%, Delivery: 20%
   */
  calculateScore(
    price: number,
    rating: number,
    deliveryDays: number,
    allPrices: number[],
    allDeliveries: number[]
  ): number {
    const maxPrice = Math.max(...allPrices);
    const minPrice = Math.min(...allPrices);
    const maxDelivery = Math.max(...allDeliveries);
    const minDelivery = Math.min(...allDeliveries);

    const priceScore = maxPrice === minPrice ? 100 : ((maxPrice - price) / (maxPrice - minPrice)) * 100;
    const deliveryScore = maxDelivery === minDelivery ? 100 : ((maxDelivery - deliveryDays) / (maxDelivery - minDelivery)) * 100;
    const ratingScore = (rating / 5) * 100;

    return Math.round((ratingScore * 0.4) + (priceScore * 0.4) + (deliveryScore * 0.2));
  },

  /**
   * Identifies best value among a set of offers.
   */
  getBestValueId<T extends { id: string; price: number; rating: number; deliveryDays: number }>(offers: T[]): string | null {
    if (offers.length === 0) return null;
    
    const prices = offers.map(o => o.price);
    const deliveries = offers.map(o => o.deliveryDays);

    const scored = offers.map(o => ({
      id: o.id,
      score: this.calculateScore(o.price, o.rating, o.deliveryDays, prices, deliveries)
    }));

    return scored.reduce((prev, curr) => (curr.score > prev.score ? curr : prev)).id;
  },

  /**
   * Calculates potential savings relative to the highest price in the set.
   */
  calculateSavings(price: number, maxPrice: number): number {
    if (maxPrice <= 0) return 0;
    return Math.round(((maxPrice - price) / maxPrice) * 100);
  },

  /**
   * Generates AI-style procurement insights.
   */
  getInsights(offers: any[], lang: 'ar' | 'en'): string[] {
    const isAr = lang === 'ar';
    if (offers.length < 2) return [];

    const bestValue = offers.reduce((prev, curr) => (curr.procurementScore > prev.procurementScore ? curr : prev));
    
    return [
      isAr 
        ? `المورد "${bestValue.supplierName}" يقدم أفضل توازن بين السعر والسرعة مع درجة مشتريات ${bestValue.procurementScore}%.` 
        : `"${bestValue.supplierName}" offers the best balance of price and speed with an ${bestValue.procurementScore}% procurement score.`,
      isAr
        ? "بناءً على تحليلنا، اختيار العرض الموصى به يوفر الجودة دون تجاوز الميزانية."
        : "Based on our analysis, choosing the recommended offer ensures quality without exceeding budget."
    ];
  }
};
