'use server';

/**
 * @fileOverview Recommends specific fertilizers tailored to the farmer's crop and soil conditions.
 *
 * - recommendFertilizers - A function that recommends fertilizers based on crop and soil conditions.
 * - RecommendFertilizersInput - The input type for the recommendFertilizers function.
 * - RecommendFertilizersOutput - The return type for the recommendFertilizers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendFertilizersInputSchema = z.object({
  crop: z.string().describe('The type of crop being grown.'),
  soilConditions: z.string().describe('A description of the soil conditions, including test results.'),
  region: z.string().describe('The geographical region where the farm is located.'),
});
export type RecommendFertilizersInput = z.infer<typeof RecommendFertilizersInputSchema>;

const RecommendFertilizersOutputSchema = z.object({
  fertilizerRecommendations: z
    .array(z.string())
    .describe(
      'A list of specific fertilizer recommendations in point form, tailored to the crop and soil conditions.'
    ),
  reasoning: z.string().describe('The AI reasoning behind the fertilizer recommendations.'),
});
export type RecommendFertilizersOutput = z.infer<typeof RecommendFertilizersOutputSchema>;

export async function recommendFertilizers(input: RecommendFertilizersInput): Promise<RecommendFertilizersOutput> {
  return recommendFertilizersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendFertilizersPrompt',
  input: {schema: RecommendFertilizersInputSchema},
  output: {schema: RecommendFertilizersOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the farmer's crop, soil conditions, and region, recommend specific fertilizers for optimal yield.

Crop: {{{crop}}}
Soil Conditions: {{{soilConditions}}}
Region: {{{region}}}

Provide specific fertilizer recommendations as a list of bullet points. Also, explain the reasoning behind your choices.`,
});

const recommendFertilizersFlow = ai.defineFlow(
  {
    name: 'recommendFertilizersFlow',
    inputSchema: RecommendFertilizersInputSchema,
    outputSchema: RecommendFertilizersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
