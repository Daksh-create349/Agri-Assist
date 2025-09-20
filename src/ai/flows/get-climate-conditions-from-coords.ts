'use server';
/**
 * @fileOverview A Genkit flow to get climate conditions from geographic coordinates.
 *
 * - getClimateConditionsFromCoords - A function that returns climate conditions from latitude and longitude.
 * - GetClimateConditionsFromCoordsInput - The input type for the function.
 * - GetClimateConditionsFromCoordsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetClimateConditionsFromCoordsInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type GetClimateConditionsFromCoordsInput = z.infer<typeof GetClimateConditionsFromCoordsInputSchema>;

const GetClimateConditionsFromCoordsOutputSchema = z.object({
  climateConditions: z
    .string()
    .describe(
      'A description of the climate conditions (e.g., "Hot, dry summers with mild, wet winters. Average rainfall 20 inches.").'
    ),
});
export type GetClimateConditionsFromCoordsOutput = z.infer<typeof GetClimateConditionsFromCoordsOutputSchema>;

export async function getClimateConditionsFromCoords(
  input: GetClimateConditionsFromCoordsInput
): Promise<GetClimateConditionsFromCoordsOutput> {
  return getClimateConditionsFromCoordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getClimateConditionsFromCoordsPrompt',
  input: {schema: GetClimateConditionsFromCoordsInputSchema},
  output: {schema: GetClimateConditionsFromCoordsOutputSchema},
  prompt: `Based on the following geographic coordinates, provide a description of the typical climate conditions. Include details like temperature ranges for seasons, average rainfall, and general weather patterns.

Latitude: {{{latitude}}}
Longitude: {{{longitude}}}

Return a concise, one-paragraph description.`,
});

const getClimateConditionsFromCoordsFlow = ai.defineFlow(
  {
    name: 'getClimateConditionsFromCoordsFlow',
    inputSchema: GetClimateConditionsFromCoordsInputSchema,
    outputSchema: GetClimateConditionsFromCoordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
