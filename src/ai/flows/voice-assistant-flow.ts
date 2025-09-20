'use server';
/**
 * @fileOverview A voice assistant flow that uses text-to-speech.
 * - voiceAssistant - A function that takes text and returns an audio response.
 * - VoiceAssistantInput - The input type for the voiceAssistant function.
 * - VoiceAssistantOutput - The return type for the voiceAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

const VoiceAssistantInputSchema = z.object({
  query: z.string().describe('The user query as text.'),
  language: z.enum(['en-US', 'hi-IN', 'mr-IN']).describe('The language for the response.'),
});
export type VoiceAssistantInput = z.infer<typeof VoiceAssistantInputSchema>;

const VoiceAssistantOutputSchema = z.object({
  audio: z.string().describe("The base64 encoded WAV audio data URI."),
  text: z.string().describe("The text response from the assistant."),
});
export type VoiceAssistantOutput = z.infer<typeof VoiceAssistantOutputSchema>;

export async function voiceAssistant(
  input: VoiceAssistantInput
): Promise<VoiceAssistantOutput> {
  return voiceAssistantFlow(input);
}

const voiceMap = {
    'en-US': 'algenib',
    'hi-IN': 'rasalgethi',
    'mr-IN': 'schedar',
}

const prompt = ai.definePrompt({
  name: 'voiceAssistantPrompt',
  input: { schema: VoiceAssistantInputSchema },
  output: { schema: z.object({ response: z.string() }) },
  prompt: `You are AgriAssist, an intelligent AI assistant for farmers.
You are having a voice conversation with a user. Keep your responses concise and to the point, suitable for a voice interface.
The user is speaking in {{language}}. Respond in the same language.

User's query: {{{query}}}
`,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const voiceAssistantFlow = ai.defineFlow(
  {
    name: 'voiceAssistantFlow',
    inputSchema: VoiceAssistantInputSchema,
    outputSchema: VoiceAssistantOutputSchema,
  },
  async (input) => {
    const llmResponse = await prompt(input);
    const textResponse = llmResponse.output?.response || 'Sorry, I could not process your request.';

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // @ts-ignore - prebuiltVoiceConfig is valid
            prebuiltVoiceConfig: { voiceName: voiceMap[input.language] || 'algenib' },
          },
        },
      },
      prompt: textResponse,
    });
    if (!media) {
      throw new Error('no media returned from TTS model');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavData = await toWav(audioBuffer);

    return {
      audio: 'data:audio/wav;base64,' + wavData,
      text: textResponse,
    };
  }
);
