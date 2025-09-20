import { LocationGuidance } from './location-guidance';

export default function CropGuidancePage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Location-Based Crop Guidance
        </h1>
        <p className="text-muted-foreground">
          Discover which crops are best suited for your specific geographic location.
        </p>
      </div>
      <LocationGuidance />
    </main>
  );
}
