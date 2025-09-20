'use server';
/**
 * @fileOverview Infers soil conditions from an image of a crop.
 *
 * - inferSoilConditionsFromCropImage - A function that analyzes a crop image to infer soil conditions.
 * - InferSoilConditionsFromCropImageInput - The input type for the function.
 * - InferSoilConditionsFromCropImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InferSoilConditionsFromCropImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type InferSoilConditionsFromCropImageInput = z.infer<typeof InferSoilConditionsFromCropImageInputSchema>;

const InferSoilConditionsFromCropImageOutputSchema = z.object({
  soilConditions: z
    .string()
    .describe(
      'A description of the inferred soil conditions based on the crop\'s appearance (e.g., "The yellowing leaves suggest a potential nitrogen deficiency.").'
    ),
});
export type InferSoilConditionsFromCropImageOutput = z.infer<typeof InferSoilConditionsFromCropImageOutputSchema>;

export async function inferSoilConditionsFromCropImage(
  input: InferSoilConditionsFromCropImageInput
): Promise<InferSoilConditionsFromCropImageOutput> {
  return inferSoilConditionsFromCropImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inferSoilConditionsFromCropImagePrompt',
  input: {schema: InferSoilConditionsFromCropImageInputSchema},
  output: {schema: InferSoilConditionsFromCropImageOutputSchema},
  prompt: `You are an expert agriculturalist and botanist. Analyze the provided image of a crop. 
Based on the visual cues in the photo, such as leaf color, spots, wilting, or other signs of distress, infer the potential soil conditions or nutrient deficiencies. 
Provide a concise, one-paragraph description of these inferred conditions.

Image: {{media url=photoDataUri}}
`,
});

const inferSoilConditionsFromCropImageFlow = ai.defineFlow(
  {
    name: 'inferSoilConditionsFromCropImageFlow',
    inputSchema: InferSoilConditionsFromCropImageInputSchema,
    outputSchema: InferSoilConditionsFromCropImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
