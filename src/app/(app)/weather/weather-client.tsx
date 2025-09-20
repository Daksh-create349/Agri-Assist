'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, MapPin, CloudSun, Sunrise, Sunset, Wind, Droplets, Thermometer, Cloudy, Sun, CloudRain, Leaf } from 'lucide-react';
import { getWeatherFromCoords, type GetWeatherFromCoordsOutput } from '@/ai/flows/get-weather-from-coords';
import { suggestCropsBasedOnWeather, type SuggestCropsBasedOnWeatherOutput } from '@/ai/flows/suggest-crops-based-on-weather';
import { Separator } from '@/components/ui/separator';

type WeatherState = {
  status: 'idle' | 'loadingCoords' | 'loadingWeather' | 'success' | 'error';
  weatherData?: GetWeatherFromCoordsOutput;
  cropAdvisory?: SuggestCropsBasedOnWeatherOutput;
  error?: string;
};

const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('shower')) return <CloudRain className="h-6 w-6 text-blue-400" />;
    if (desc.includes('cloud')) return <Cloudy className="h-6 w-6 text-gray-400" />;
    if (desc.includes('sun') || desc.includes('clear')) return <Sun className="h-6 w-6 text-yellow-400" />;
    return <CloudSun className="h-6 w-6 text-gray-500" />;
}

export function WeatherClient() {
  const [weatherState, setWeatherState] = useState<WeatherState>({ status: 'idle' });
  const { toast } = useToast();

  const fetchWeatherData = async (coords: GeolocationCoordinates) => {
    setWeatherState(prevState => ({ ...prevState, status: 'loadingWeather' }));
    try {
      const { latitude, longitude } = coords;
      const weatherResponse = await getWeatherFromCoords({ latitude, longitude });
      
      const weatherSummary = `Current: ${weatherResponse.temperature}°C, ${weatherResponse.description}. Forecast: ${weatherResponse.fiveDayForecast.map(d => `${d.day} ${d.highTemp}°/${d.lowTemp}°`).join(', ')}`;
      const cropResponse = await suggestCropsBasedOnWeather({ weatherSummary });

      setWeatherState({ status: 'success', weatherData: weatherResponse, cropAdvisory: cropResponse });
    } catch (error) {
      console.error("Failed to fetch weather data", error);
      toast({
        variant: 'destructive',
        title: 'Could not fetch weather data',
        description: 'An error occurred while fetching the weather forecast.',
      });
      setWeatherState({ status: 'error', error: 'Failed to fetch weather data.' });
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setWeatherState({ status: 'error', error: 'Geolocation is not supported by your browser.' });
      return;
    }

    setWeatherState({ status: 'loadingCoords' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherData(position.coords);
      },
      () => {
        setWeatherState({
          status: 'error',
          error: 'Unable to retrieve your location. Please ensure location services are enabled.',
        });
      }
    );
  };
  
  useEffect(() => {
    getLocation();
  }, []);

  const renderContent = () => {
    switch (weatherState.status) {
      case 'idle':
        return (
           <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Click the button to get the weather for your location.
            </p>
            <Button onClick={getLocation} className="mt-4">
              Get My Location's Weather
            </Button>
          </div>
        );
      case 'loadingCoords':
      case 'loadingWeather':
         return (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              {weatherState.status === 'loadingCoords' ? 'Fetching your location...' : 'Fetching weather data & crop advice...'}
            </p>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/10 p-8 text-center text-destructive">
            <AlertTriangle className="h-12 w-12" />
            <p className="mt-4 font-semibold">{weatherState.error}</p>
            <Button onClick={getLocation} variant="destructive" className="mt-4">
              Try Again
            </Button>
          </div>
        );
      case 'success':
        const { weatherData: data, cropAdvisory } = weatherState;
        if (!data) return null;
        return (
        <>
        <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2"><MapPin className="h-6 w-6 text-primary"/> {data.locationName}</h2>
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
              <div className="text-2xl font-bold">{data.temperature}°C</div>
              <p className="text-xs text-muted-foreground">
                Feels like {data.feelsLike}°C. {data.description}.
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
              <div className="text-2xl font-bold">{data.humidity}%</div>
               <p className="text-xs text-muted-foreground">
                Relative humidity.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
              <Wind className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.windSpeed} km/h</div>
               <p className="text-xs text-muted-foreground">
                From the {data.windDirection}.
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
              <div className="text-xl font-bold">{data.sunrise} / {data.sunset}</div>
               <p className="text-xs text-muted-foreground">
                {data.daylightHours} of daylight.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>5-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.fiveDayForecast.map((day, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center">
                                    <div className="w-1/4 font-semibold">{day.day}</div>
                                    <div className="w-1/4 flex justify-center">{getWeatherIcon(day.description)}</div>
                                    <div className="w-1/2 text-right">
                                        <span className="font-semibold">{day.highTemp}°</span> / <span className="text-muted-foreground">{day.lowTemp}°</span>
                                    </div>
                                </div>
                                {index < data.fiveDayForecast.length - 1 && <Separator className="mt-4" />}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Leaf className="text-primary"/> Crop Advisory</CardTitle>
                    <CardDescription>Based on the current weather forecast.</CardDescription>
                </CardHeader>
                <CardContent>
                    {cropAdvisory ? (
                         <ul className="space-y-3">
                            {cropAdvisory.cropSuggestions.map((crop, index) => (
                                <li key={index}>
                                    <p className="font-semibold">{crop.name}</p>
                                    <p className="text-sm text-muted-foreground">{crop.reasoning}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center justify-center text-muted-foreground">
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading recommendations...
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        </>
        );
    }
  };

  return <div>{renderContent()}</div>;
}
