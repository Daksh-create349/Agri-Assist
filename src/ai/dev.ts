import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-crops-based-on-soil.ts';
import '@/ai/flows/identify-crop-disease-from-image.ts';
import '@/ai/flows/recommend-fertilizers.ts';
import '@/ai/flows/boost-marketplace-ranking.ts';