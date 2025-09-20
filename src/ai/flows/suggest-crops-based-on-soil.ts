
'use server';
/**
 * @fileOverview This file defines a Genkit flow to suggest suitable crops based on soil data and location.
 *
 * - suggestCrops - A function that takes soil data and location as input and returns crop suggestions.
 * - SuggestCropsInput - The input type for the suggestCrops function.
 * - SuggestCropsOutput - The return type for the suggestCrops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCropsInputSchema = z.object({
  soilData: z
    .string()
    .describe('Detailed soil analysis data including nutrient levels, pH, and texture.'),
  location: z
    .string()
    .describe(
      'The geographical location of the farm, including latitude and longitude.'
    ),
  climateConditions: z
    .string()
    .describe('Description of climate conditions of the region, including temperature, rainfall and humidity.'),
});
export type SuggestCropsInput = z.infer<typeof SuggestCropsInputSchema>;

const SuggestCropsOutputSchema = z.object({
  suggestedCrops: z
    .array(z.string())
    .describe('A list of suggested crops suitable for the given soil data, location and climatic conditions.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the crop suggestions, based on the soil analysis and location.'),
});
export type SuggestCropsOutput = z.infer<typeof SuggestCropsOutputSchema>;

export async function suggestCrops(input: SuggestCropsInput): Promise<SuggestCropsOutput> {
  return suggestCropsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCropsPrompt',
  input: {schema: SuggestCropsInputSchema},
  output: {schema: SuggestCropsOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the soil data, location, and climate conditions provided, suggest the most suitable crops for the farm.

Soil Data: {{{soilData}}}
Location: {{{location}}}
Climate Conditions: {{{climateConditions}}}

Provide a list of suggested crops and a detailed explanation of why each crop is suitable for the given conditions.
`,
});

const suggestCropsFlow = ai.defineFlow(
  {
    name: 'suggestCropsFlow',
    inputSchema: SuggestCropsInputSchema,
    outputSchema: SuggestCropsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
