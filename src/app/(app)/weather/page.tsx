import { WeatherClient } from './weather-client';

export default function WeatherPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Live Weather Forecast
        </h1>
        <p className="text-muted-foreground">
          Real-time weather updates to help you plan your farm activities.
        </p>
      </div>
      <WeatherClient />
    </main>
  );
}
