'use server';
/**
 * @fileOverview This file defines a Genkit flow to analyze soil data from manual input or an image.
 *
 * - analyzeSoilData - A function that takes soil data and returns a detailed analysis.
 * - AnalyzeSoilDataInput - The input type for the analyzeSoilData function.
 * - AnalyzeSoilDataOutput - The return type for the analyzeSoilData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSoilDataInputSchema = z.object({
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of a soil report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  phLevel: z.string().optional().describe('The pH level of the soil.'),
  organicMatter: z.string().optional().describe('The percentage of organic matter in the soil.'),
  nitrogen: z.string().optional().describe('The nitrogen level in ppm.'),
  phosphorus: z.string().optional().describe('The phosphorus level in ppm.'),
  potassium: z.string().optional().describe('The potassium level in ppm.'),
  texture: z.string().optional().describe('The texture of the soil (e.g., Loamy Sand).'),
  notes: z.string().optional().describe('Any additional notes or observations.'),
});
export type AnalyzeSoilDataInput = z.infer<typeof AnalyzeSoilDataInputSchema>;

const NutrientAnalysisSchema = z.object({
    value: z.string().describe('The value of the nutrient.'),
    status: z.string().describe('The status of the nutrient (e.g., Optimal, Low, High).'),
    advice: z.string().describe('Advice regarding the nutrient level.'),
});

const AnalyzeSoilDataOutputSchema = z.object({
  overallHealth: z.string().describe('A one-sentence overall assessment of the soil health.'),
  recommendations: z.array(z.string()).describe('A list of specific, actionable recommendations to improve soil health.'),
  nutrientAnalysis: z.object({
    ph: NutrientAnalysisSchema,
    nitrogen: NutrientAnalysisSchema,
    phosphorus: NutrientAnalysisSchema,
    potassium: NutrientAnalysisSchema,
  }).describe("Detailed analysis of key nutrients."),
});
export type AnalyzeSoilDataOutput = z.infer<typeof AnalyzeSoilDataOutputSchema>;

export async function analyzeSoilData(input: AnalyzeSoilDataInput): Promise<AnalyzeSoilDataOutput> {
  return analyzeSoilDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSoilDataPrompt',
  input: {schema: AnalyzeSoilDataInputSchema},
  output: {schema: AnalyzeSoilDataOutputSchema},
  prompt: `You are an expert soil scientist. Analyze the provided soil data and provide a detailed report.
The user may provide either an image of a soil report or manual data entries, or both. Use the image as the primary source if provided.

Soil Data:
{{#if photoDataUri}}Image: {{media url=photoDataUri}}{{/if}}
pH Level: {{{phLevel}}}
Organic Matter (%): {{{organicMatter}}}
Nitrogen (ppm): {{{nitrogen}}}
Phosphorus (ppm): {{{phosphorus}}}
Potassium (ppm): {{{potassium}}}
Soil Texture: {{{texture}}}
Additional Notes: {{{notes}}}

Your analysis should include:
1.  A one-sentence summary of the overall soil health.
2.  A detailed breakdown of each key nutrient (pH, Nitrogen, Phosphorus, Potassium), including its value, status (e.g., Low, Optimal, High), and specific advice.
3.  A list of actionable recommendations for improving the soil's health and fertility.
`,
});

const analyzeSoilDataFlow = ai.defineFlow(
  {
    name: 'analyzeSoilDataFlow',
    inputSchema: AnalyzeSoilDataInputSchema,
    outputSchema: AnalyzeSoilDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
