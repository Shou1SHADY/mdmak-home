'use server';
/**
 * @fileOverview An AI-powered tool for estimating material costs and quantities for construction or renovation projects.
 *
 * - aiMaterialCostEstimator - A function that handles the material cost estimation process.
 * - AiMaterialCostEstimatorInput - The input type for the aiMaterialCostEstimator function.
 * - AiMaterialCostEstimatorOutput - The return type for the aiMaterialCostEstimator function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiMaterialCostEstimatorInputSchema = z.object({
  projectType: z
    .enum(['new_construction', 'renovation', 'furnishing'])
    .describe('The type of construction project (e.g., new_construction, renovation, furnishing).'),
  areaInSquareMeters: z
    .number()
    .positive()
    .describe('The total area of the project in square meters.'),
  materialQuality: z
    .enum(['economy', 'standard', 'premium', 'luxury'])
    .describe('The desired quality of materials to be used.'),
  region: z
    .string()
    .describe('The region in Saudi Arabia where the project is located (e.g., Riyadh, Jeddah, Dammam).'),
  notes: z
    .string()
    .optional()
    .describe('Any additional notes or specific requirements for the project.'),
});
export type AiMaterialCostEstimatorInput = z.infer<typeof AiMaterialCostEstimatorInputSchema>;

const AiMaterialCostEstimatorOutputSchema = z.object({
  estimatedCostRange: z.object({
    min: z.number().positive().describe('The minimum estimated cost in SAR.'),
    max: z.number().positive().describe('The maximum estimated cost in SAR.'),
  }),
  currency: z.string().default('SAR').describe('The currency for the estimated costs.'),
  materialRecommendations: z.array(
    z.object({
      materialName: z.string().describe('The name of the recommended material.'),
      estimatedQuantity: z.number().positive().describe('The estimated quantity needed.'),
      unit: z.string().describe('The unit of measurement for the estimated quantity (e.g., kg, sqm, liters).'),
    })
  ).describe('A list of recommended materials with estimated quantities.'),
  disclaimer: z
    .string()
    .describe('A disclaimer stating that the provided costs and quantities are estimates and subject to change.'),
});
export type AiMaterialCostEstimatorOutput = z.infer<typeof AiMaterialCostEstimatorOutputSchema>;

export async function aiMaterialCostEstimator(
  input: AiMaterialCostEstimatorInput
): Promise<AiMaterialCostEstimatorOutput> {
  return aiMaterialCostEstimatorFlow(input);
}

const materialCostEstimatorPrompt = ai.definePrompt({
  name: 'materialCostEstimatorPrompt',
  input: { schema: AiMaterialCostEstimatorInputSchema },
  output: { schema: AiMaterialCostEstimatorOutputSchema },
  prompt: `You are an AI-powered construction material cost and quantity estimator for MDMAK Home in Saudi Arabia.
Your task is to provide estimated material costs and quantities for construction, renovation, or furnishing projects based on the provided details.

Consider regional price variations, typical material usage for the specified project type, and the requested material quality.

Input details for the project:
Project Type: {{{projectType}}}
Area: {{{areaInSquareMeters}}} square meters
Material Quality: {{{materialQuality}}}
Region: {{{region}}}
Additional Notes: {{{notes}}}

Based on these details, provide a realistic estimated cost range in Saudi Riyals (SAR) and a list of key material recommendations with their estimated quantities and units.
Always include a clear disclaimer that these are estimates and actual costs may vary.`,
});

const aiMaterialCostEstimatorFlow = ai.defineFlow(
  {
    name: 'aiMaterialCostEstimatorFlow',
    inputSchema: AiMaterialCostEstimatorInputSchema,
    outputSchema: AiMaterialCostEstimatorOutputSchema,
  },
  async (input) => {
    const { output } = await materialCostEstimatorPrompt(input);
    return output!;
  }
);
