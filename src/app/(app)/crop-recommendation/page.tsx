import { CropRecommendationForm } from './crop-recommendation-form';

export default function CropRecommendationPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          AI Crop Recommendation
        </h1>
        <p className="text-muted-foreground">
          Get suggestions for suitable crops based on your soil, location, and climate.
        </p>
      </div>
      <CropRecommendationForm />
    </main>
  );
}
