import { FertilizerRecommendationForm } from './fertilizer-recommendation-form';

export default function FertilizerRecommendationPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          AI Fertilizer Recommendation
        </h1>
        <p className="text-muted-foreground">
          Get tailored fertilizer suggestions for your specific crop and soil conditions.
        </p>
      </div>
      <FertilizerRecommendationForm />
    </main>
  );
}
