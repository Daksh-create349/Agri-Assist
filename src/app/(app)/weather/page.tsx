import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, Sunrise, Sunset, Wind, Droplets, Thermometer } from 'lucide-react';

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
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Temperature
              </CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28°C</div>
              <p className="text-xs text-muted-foreground">
                Feels like 32°C. Clear skies.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Humidity
              </CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
               <p className="text-xs text-muted-foreground">
                High humidity today.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
              <Wind className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 km/h</div>
               <p className="text-xs text-muted-foreground">
                Gentle breeze from the South-West.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sunrise & Sunset</CardTitle>
               <div className="flex gap-2">
                <Sunrise className="h-4 w-4 text-muted-foreground" />
                <Sunset className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">6:05 AM / 7:15 PM</div>
               <p className="text-xs text-muted-foreground">
                13 hours and 10 minutes of daylight.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>5-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Detailed 5-day forecast coming soon...</p>
                </CardContent>
            </Card>
        </div>
    </main>
  );
}
