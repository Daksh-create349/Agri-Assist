'use server';
/**
 * @fileOverview A Genkit flow to suggest crops based on weather conditions.
 *
 * - suggestCropsBasedOnWeather - A function that returns crop suggestions based on a weather summary.
 * - SuggestCropsBasedOnWeatherInput - The input type for the function.
 * - SuggestCropsBasedOnWeatherOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCropsBasedOnWeatherInputSchema = z.object({
  weatherSummary: z.string().describe('A summary of the current and forecasted weather conditions.'),
});
export type SuggestCropsBasedOnWeatherInput = z.infer<typeof SuggestCropsBasedOnWeatherInputSchema>;

const SuggestedCropSchema = z.object({
    name: z.string().describe('The name of the suggested crop.'),
    reasoning: z.string().describe('A brief reason why this crop is suitable for the given weather.'),
});

const SuggestCropsBasedOnWeatherOutputSchema = z.object({
  cropSuggestions: z
    .array(SuggestedCropSchema)
    .describe('A list of suggested crops suitable for the given weather conditions.'),
});
export type SuggestCropsBasedOnWeatherOutput = z.infer<typeof SuggestCropsBasedOnWeatherOutputSchema>;

export async function suggestCropsBasedOnWeather(
  input: SuggestCropsBasedOnWeatherInput
): Promise<SuggestCropsBasedOnWeatherOutput> {
  return suggestCropsBasedOnWeatherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCropsBasedOnWeatherPrompt',
  input: {schema: SuggestCropsBasedOnWeatherInputSchema},
  output: {schema: SuggestCropsBasedOnWeatherOutputSchema},
  prompt: `You are an agricultural expert. Based on the following weather summary, suggest 3-4 suitable crops. 
For each crop, provide a brief, one-sentence reason why it's a good choice for these conditions.

Weather Summary:
{{{weatherSummary}}}
`,
});

const suggestCropsBasedOnWeatherFlow = ai.defineFlow(
  {
    name: 'suggestCropsBasedOnWeatherFlow',
    inputSchema: SuggestCropsBasedOnWeatherInputSchema,
    outputSchema: SuggestCropsBasedOnWeatherOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
