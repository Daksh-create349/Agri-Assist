import { SoilAnalysisForm } from './soil-analysis-form';

export default function SoilAnalysisPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Soil Analysis
        </h1>
        <p className="text-muted-foreground">
          Enter or upload your soil test results for a detailed breakdown.
        </p>
      </div>
      <SoilAnalysisForm />
    </main>
  );
}
