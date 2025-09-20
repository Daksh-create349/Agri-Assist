import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-crops-based-on-soil.ts';
import '@/ai/flows/identify-crop-disease-from-image.ts';
import '@/ai/flows/recommend-fertilizers.ts';
import '@/ai/flows/boost-marketplace-ranking.ts';
import '@/ai/flows/get-location-name-from-coords.ts';
import '@/ai/flows/analyze-soil-data.ts';
import '@/ai/flows/get-climate-conditions-from-coords.ts';
import '@/ai/flows/infer-soil-conditions-from-crop-image.ts';
import '@/ai/flows/voice-assistant-flow.ts';
import '@/ai/flows/extract-aadhar-details.ts';
