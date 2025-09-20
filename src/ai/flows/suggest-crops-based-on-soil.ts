
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
  location: z
    .string()
    .describe(
      'The geographical location of the farm (e.g., city, state, country).'
    ),
  climateConditions: z
    .string()
    .describe('Description of climate conditions of the region, including temperature, rainfall and humidity.'),
  phLevel: z.string().optional().describe('The pH level of the soil.'),
  organicMatter: z.string().optional().describe('The percentage of organic matter in the soil.'),
  nitrogen: z.string().optional().describe('The nitrogen level in ppm.'),
  phosphorus: z.string().optional().describe('The phosphorus level in ppm.'),
  potassium: z.string().optional().describe('The potassium level in ppm.'),
  soilTexture: z.string().optional().describe('The texture of the soil (e.g., Loamy Sand).'),
  overallHealth: z.string().optional().describe('A summary of the overall soil health.'),
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
  prompt: `You are an expert agricultural advisor. Based on the following farm conditions, suggest the most suitable crops.

Location: {{{location}}}
Climate: {{{climateConditions}}}

Soil Analysis:
- pH Level: {{{phLevel}}}
- Organic Matter: {{{organicMatter}}}
- Nitrogen (ppm): {{{nitrogen}}}
- Phosphorus (ppm): {{{phosphorus}}}
- Potassium (ppm): {{{potassium}}}
- Texture: {{{soilTexture}}}
- Overall Health Summary: {{{overallHealth}}}

Please provide a list of suggested crops and a detailed explanation of why each is suitable for these specific conditions.
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
