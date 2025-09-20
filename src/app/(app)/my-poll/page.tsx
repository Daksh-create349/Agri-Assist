import { MyPollClient } from './my-poll-client';

export default function MyPollPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          My Poll - Real-time Soil Sensor
        </h1>
        <p className="text-muted-foreground">
          Live data feed from your ground-installed hardware sensor.
        </p>
      </div>
      <MyPollClient />
    </main>
  );
}
