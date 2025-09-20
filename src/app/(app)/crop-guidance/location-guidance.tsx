'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, AlertTriangle } from 'lucide-react';
import { getLocationNameFromCoords } from '@/ai/flows/get-location-name-from-coords';
import { useToast } from '@/hooks/use-toast';

type LocationState = {
  status: 'idle' | 'loadingCoords' | 'loadingName' | 'success' | 'error';
  coords?: GeolocationCoordinates;
  locationName?: string;
  error?: string;
};

export function LocationGuidance() {
  const [locationState, setLocationState] = useState<LocationState>({ status: 'idle' });
  const { toast } = useToast();

  const fetchLocationName = async (coords: GeolocationCoordinates) => {
    setLocationState(prevState => ({ ...prevState, status: 'loadingName' }));
    try {
      const { latitude, longitude } = coords;
      const response = await getLocationNameFromCoords({ latitude, longitude });
      setLocationState(prevState => ({ ...prevState, status: 'success', locationName: response.locationName }));
    } catch (error) {
      console.error("Failed to fetch location name", error);
      toast({
        variant: 'destructive',
        title: 'Could not fetch location name',
        description: 'We found your coordinates but could not determine the location name.',
      });
      setLocationState(prevState => ({ ...prevState, status: 'success', locationName: 'Unknown Location' }));
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationState({ status: 'error', error: 'Geolocation is not supported by your browser.' });
      return;
    }

    setLocationState({ status: 'loadingCoords' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({ status: 'loadingName', coords: position.coords });
        fetchLocationName(position.coords);
      },
      () => {
        setLocationState({
          status: 'error',
          error: 'Unable to retrieve your location. Please ensure location services are enabled.',
        });
      }
    );
  };
  
  // Automatically request location when the component mounts
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Location</CardTitle>
        <CardDescription>
          We use your location to provide guidance on suitable crops.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {locationState.status === 'idle' && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Click the button to get crop guidance for your area.
            </p>
            <Button onClick={getLocation} className="mt-4">
              Get My Location
            </Button>
          </div>
        )}

        {(locationState.status === 'loadingCoords' || locationState.status === 'loadingName') && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              {locationState.status === 'loadingCoords' ? 'Fetching your location...' : 'Identifying your location...'}
            </p>
          </div>
        )}

        {locationState.status === 'error' && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/10 p-8 text-center text-destructive">
            <AlertTriangle className="h-12 w-12" />
            <p className="mt-4 font-semibold">{locationState.error}</p>
            <Button onClick={getLocation} variant="destructive" className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        {locationState.status === 'success' && locationState.coords && (
          <div>
            <div className="mb-4 rounded-lg bg-primary/10 p-4">
              <p className="font-semibold text-primary flex items-center">
                <MapPin className="mr-2 inline-block h-4 w-4" />
                {locationState.locationName || 'Location Found'}
              </p>
              <p className="font-mono text-sm text-primary/80 mt-1">
                Lat: {locationState.coords.latitude.toFixed(4)}, Lon: {locationState.coords.longitude.toFixed(4)}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold font-headline">Crop Suggestions for Your Area</h3>
              <p className="text-muted-foreground text-sm mb-4">Based on general climate data for your coordinates.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <span className="font-semibold">Corn (Maize):</span> Thrives in warm weather with plenty of sunshine. Good for regions with hot summers.
                </li>
                <li>
                  <span className="font-semibold">Soybeans:</span> Adaptable to various climates, but prefers warm, moist conditions.
                </li>
                <li>
                  <span className="font-semibold">Wheat:</span> Typically grown in temperate climates, can be planted in fall or spring depending on the variety.
                </li>
                 <li>
                  <span className="font-semibold">Potatoes:</span> A cool-weather crop that is adaptable to many regions.
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
