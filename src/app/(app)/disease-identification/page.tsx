import { DiseaseIdentificationForm } from './disease-identification-form';

export default function DiseaseIdentificationPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Image-Based Disease Identification
        </h1>
        <p className="text-muted-foreground">
          Upload a photo of a crop to identify potential diseases using AI.
        </p>
      </div>
      <DiseaseIdentificationForm />
    </main>
  );
}
