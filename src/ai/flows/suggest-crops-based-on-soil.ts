
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
  farmlandArea: z.number().optional().describe('The area of the farmland.'),
  farmlandUnit: z.enum(['hectares', 'acres']).optional().describe('The unit for the farmland area.'),
});
export type SuggestCropsInput = z.infer<typeof SuggestCropsInputSchema>;

const SuggestedCropSchema = z.object({
    name: z.string().describe('The name of the suggested crop.'),
    seedPrice: z.number().describe('The current market price of the seeds for this crop.'),
    priceUnit: z.string().describe('The unit for the seed price (e.g., "per quintal", "per kg").'),
});

const SuggestCropsOutputSchema = z.object({
  suggestedCrops: z
    .array(SuggestedCropSchema)
    .describe('A list of suggested crops suitable for the given soil data, location and climatic conditions, including seed price information.'),
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
Also provide the current market price for the seeds of each suggested crop.

Farm Details:
Location: {{{location}}}
Climate: {{{climateConditions}}}
{{#if farmlandArea}}Farmland Area: {{{farmlandArea}}} {{{farmlandUnit}}}{{/if}}

Soil Analysis:
- pH Level: {{{phLevel}}}
- Organic Matter: {{{organicMatter}}}
- Nitrogen (ppm): {{{nitrogen}}}
- Phosphorus (ppm): {{{phosphorus}}}
- Potassium (ppm): {{{potassium}}}
- Texture: {{{soilTexture}}}
- Overall Health Summary: {{{overallHealth}}}

Your task:
1.  Provide a list of suggested crops.
2.  For each crop, find the current market price for its seeds.
3.  IMPORTANT PRICING LOGIC:
    - If the farmland unit is 'hectares', the seed price MUST be per quintal.
    - If the farmland unit is 'acres', the seed price MUST be per kilogram (kg).
    - If no farmland unit is provided, default to per kilogram (kg).

Return only the list of crops and their seed prices in the specified format. Do not include any reasoning or explanations.
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
