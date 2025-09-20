// BoostMarketplaceRanking measures the attractiveness of marketplace offers using AI.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OfferAttractivenessInputSchema = z.object({
  adCopy: z.string().describe('The ad copy of the offer.'),
  productDescription: z.string().describe('The description of the product being offered.'),
  targetAudience: z.string().describe('The target audience for the offer.'),
});
export type OfferAttractivenessInput = z.infer<typeof OfferAttractivenessInputSchema>;

const OfferAttractivenessOutputSchema = z.object({
  attractivenessScore: z
    .number()
    .describe('A score between 0 and 1 indicating the attractiveness of the offer.'),
  suggestions: z.array(z.string()).describe('Suggestions to improve the offer.'),
});
export type OfferAttractivenessOutput = z.infer<typeof OfferAttractivenessOutputSchema>;

export async function boostMarketplaceRanking(input: OfferAttractivenessInput): Promise<OfferAttractivenessOutput> {
  return boostMarketplaceRankingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'offerAttractivenessPrompt',
  input: {schema: OfferAttractivenessInputSchema},
  output: {schema: OfferAttractivenessOutputSchema},
  prompt: `You are an AI expert in marketing and advertising. Your job is to analyze the attractiveness of marketplace offers and provide suggestions for improvement.

  Here is the offer information:
  Ad Copy: {{{adCopy}}}
  Product Description: {{{productDescription}}}
  Target Audience: {{{targetAudience}}}

  Based on this information, please provide an attractiveness score between 0 and 1 (where 1 is the most attractive) and suggestions to improve the offer.
  The score should be based on how well the ad copy and product description resonate with the target audience.
  Consider factors such as clarity, relevance, and persuasiveness.
  The suggestions should be specific and actionable.
  `,
});

const boostMarketplaceRankingFlow = ai.defineFlow(
  {
    name: 'boostMarketplaceRankingFlow',
    inputSchema: OfferAttractivenessInputSchema,
    outputSchema: OfferAttractivenessOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
