'use server';
/**
 * @fileOverview Identifies potential crop diseases from an image uploaded by a farmer.
 *
 * - identifyCropDiseaseFromImage - A function that handles the crop disease identification process.
 * - IdentifyCropDiseaseFromImageInput - The input type for the identifyCropDiseaseFromImage function.
 * - IdentifyCropDiseaseFromImageOutput - The return type for the identifyCropDiseaseFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyCropDiseaseFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a diseased crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyCropDiseaseFromImageInput = z.infer<typeof IdentifyCropDiseaseFromImageInputSchema>;

const IdentifyCropDiseaseFromImageOutputSchema = z.object({
  diseaseIdentification: z.object({
    likelyDisease: z.string().describe('The most likely disease affecting the crop.'),
    confidenceLevel: z
      .number()
      .describe('The confidence level (0-1) of the disease identification.'),
    possibleSolutions: z.string().describe('Possible solutions to treat the disease.'),
  }),
});
export type IdentifyCropDiseaseFromImageOutput = z.infer<typeof IdentifyCropDiseaseFromImageOutputSchema>;

export async function identifyCropDiseaseFromImage(
  input: IdentifyCropDiseaseFromImageInput
): Promise<IdentifyCropDiseaseFromImageOutput> {
  return identifyCropDiseaseFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyCropDiseaseFromImagePrompt',
  input: {schema: IdentifyCropDiseaseFromImageInputSchema},
  output: {schema: IdentifyCropDiseaseFromImageOutputSchema},
  prompt: `You are an expert in identifying crop diseases from images.

  Analyze the provided image of the diseased crop and identify the most likely disease affecting it.
  Also, provide a confidence level (0-1) for your identification and suggest possible solutions to treat the disease.

  Image: {{media url=photoDataUri}}
  `,
});

const identifyCropDiseaseFromImageFlow = ai.defineFlow(
  {
    name: 'identifyCropDiseaseFromImageFlow',
    inputSchema: IdentifyCropDiseaseFromImageInputSchema,
    outputSchema: IdentifyCropDiseaseFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
