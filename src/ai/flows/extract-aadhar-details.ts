'use server';
/**
 * @fileOverview Extracts user details from an Aadhar card image.
 *
 * - extractAadharDetails - A function that handles the Aadhar card detail extraction process.
 * - ExtractAadharDetailsInput - The input type for the extractAadharDetails function.
 * - ExtractAadharDetailsOutput - The return type for the extractAadharDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractAadharDetailsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an Aadhar card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractAadharDetailsInput = z.infer<typeof ExtractAadharDetailsInputSchema>;

const ExtractAadharDetailsOutputSchema = z.object({
  fullName: z.string().describe("The full name of the person as written on the Aadhar card."),
  aadharNumber: z.string().describe("The 12-digit Aadhar number, formatted as XXXX XXXX XXXX."),
});
export type ExtractAadharDetailsOutput = z.infer<typeof ExtractAadharDetailsOutputSchema>;

export async function extractAadharDetails(
  input: ExtractAadharDetailsInput
): Promise<ExtractAadharDetailsOutput> {
  return extractAadharDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractAadharDetailsPrompt',
  input: {schema: ExtractAadharDetailsInputSchema},
  output: {schema: ExtractAadharDetailsOutputSchema},
  prompt: `You are an expert optical character recognition (OCR) system. Your task is to analyze the provided image of an Indian Aadhar card and extract the person's full name and their 12-digit Aadhar number.

  - The name is usually located near the top of the card.
  - The Aadhar number is a 12-digit number, often displayed in a XXXX XXXX XXXX format.
  - Extract the details accurately.

  Image of Aadhar Card: {{media url=photoDataUri}}
  `,
});

const extractAadharDetailsFlow = ai.defineFlow(
  {
    name: 'extractAadharDetailsFlow',
    inputSchema: ExtractAadharDetailsInputSchema,
    outputSchema: ExtractAadharDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
