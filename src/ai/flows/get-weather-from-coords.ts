'use server';
/**
 * @fileOverview A Genkit flow to get simulated weather conditions from geographic coordinates.
 *
 * - getWeatherFromCoords - A function that returns weather conditions from latitude and longitude.
 * - GetWeatherFromCoordsInput - The input type for the function.
 * - GetWeatherFromCoordsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetWeatherFromCoordsInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type GetWeatherFromCoordsInput = z.infer<typeof GetWeatherFromCoordsInputSchema>;

const DailyForecastSchema = z.object({
    day: z.string().describe('The day of the week (e.g., "Monday").'),
    highTemp: z.number().describe('The forecasted high temperature in Celsius.'),
    lowTemp: z.number().describe('The forecasted low temperature in Celsius.'),
    description: z.string().describe('A short description of the forecasted weather (e.g., "Partly cloudy").'),
});

const GetWeatherFromCoordsOutputSchema = z.object({
    locationName: z.string().describe('The name of the location (e.g., "City, State, Country").'),
    temperature: z.number().describe('The current temperature in Celsius.'),
    feelsLike: z.number().describe('What the temperature feels like in Celsius.'),
    description: z.string().describe('A short description of the weather (e.g., "Clear skies").'),
    humidity: z.number().describe('The humidity percentage.'),
    windSpeed: z.number().describe('The wind speed in km/h.'),
    windDirection: z.string().describe('The wind direction (e.g., "South-West").'),
    sunrise: z.string().describe('The sunrise time (e.g., "6:05 AM").'),
    sunset: z.string().describe('The sunset time (e.g., "7:15 PM").'),
    daylightHours: z.string().describe('The total hours of daylight.'),
    fiveDayForecast: z.array(DailyForecastSchema).describe('A 5-day weather forecast.'),
});
export type GetWeatherFromCoordsOutput = z.infer<typeof GetWeatherFromCoordsOutputSchema>;

export async function getWeatherFromCoords(
  input: GetWeatherFromCoordsInput
): Promise<GetWeatherFromCoordsOutput> {
  return getWeatherFromCoordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getWeatherFromCoordsPrompt',
  input: {schema: GetWeatherFromCoordsInputSchema},
  output: {schema: GetWeatherFromCoordsOutputSchema},
  prompt: `You are a weather simulation AI. Based on the following geographic coordinates, generate a realistic but fictional real-time weather report and a 5-day forecast.

Do not use any external tools. Create plausible data based on the general climate expected at the location.

Latitude: {{{latitude}}}
Longitude: {{{longitude}}}

Your response must include all fields in the output schema, including the current weather conditions and the 5-day forecast.
`,
});

const getWeatherFromCoordsFlow = ai.defineFlow(
  {
    name: 'getWeatherFromCoordsFlow',
    inputSchema: GetWeatherFromCoordsInputSchema,
    outputSchema: GetWeatherFromCoordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
