'use server';
/**
 * @fileOverview A Genkit flow to get a location name from geographic coordinates.
 *
 * - getLocationNameFromCoords - A function that returns a location name from latitude and longitude.
 * - GetLocationNameFromCoordsInput - The input type for the function.
 * - GetLocationNameFromCoordsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetLocationNameFromCoordsInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type GetLocationNameFromCoordsInput = z.infer<typeof GetLocationNameFromCoordsInputSchema>;

const GetLocationNameFromCoordsOutputSchema = z.object({
  locationName: z.string().describe('The name of the location (e.g., "City, State, Country").'),
});
export type GetLocationNameFromCoordsOutput = z.infer<typeof GetLocationNameFromCoordsOutputSchema>;

export async function getLocationNameFromCoords(
  input: GetLocationNameFromCoordsInput
): Promise<GetLocationNameFromCoordsOutput> {
  return getLocationNameFromCoordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getLocationNameFromCoordsPrompt',
  input: {schema: GetLocationNameFromCoordsInputSchema},
  output: {schema: GetLocationNameFromCoordsOutputSchema},
  prompt: `Based on the following geographic coordinates, provide the name of the location (e.g., City, State, Country).

Latitude: {{{latitude}}}
Longitude: {{{longitude}}}

Return only the location name.`,
});

const getLocationNameFromCoordsFlow = ai.defineFlow(
  {
    name: 'getLocationNameFromCoordsFlow',
    inputSchema: GetLocationNameFromCoordsInputSchema,
    outputSchema: GetLocationNameFromCoordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
