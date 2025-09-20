'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, AlertTriangle } from 'lucide-react';
import { getLocationNameFromCoords } from '@/ai/flows/get-location-name-from-coords';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

type LocationState = {
  status: 'idle' | 'loadingCoords' | 'loadingName' | 'success' | 'error';
  coords?: GeolocationCoordinates;
  locationName?: string;
  error?: string;
};

export function LocationGuidance() {
  const t = useTranslations('CropGuidance');
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
        title: t('toast.fetchNameErrorTitle'),
        description: t('toast.fetchNameErrorDescription'),
      });
      setLocationState(prevState => ({ ...prevState, status: 'success', locationName: t('unknownLocation') }));
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationState({ status: 'error', error: t('geolocationNotSupported') });
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
          error: t('unableToRetrieveLocation'),
        });
      }
    );
  };
  
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('yourLocation')}</CardTitle>
        <CardDescription>
          {t('locationDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {locationState.status === 'idle' && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              {t('idleText')}
            </p>
            <Button onClick={getLocation} className="mt-4">
              {t('getMyLocationButton')}
            </Button>
          </div>
        )}

        {(locationState.status === 'loadingCoords' || locationState.status === 'loadingName') && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              {locationState.status === 'loadingCoords' ? t('fetchingLocation') : t('identifyingLocation')}
            </p>
          </div>
        )}

        {locationState.status === 'error' && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/10 p-8 text-center text-destructive">
            <AlertTriangle className="h-12 w-12" />
            <p className="mt-4 font-semibold">{locationState.error}</p>
            <Button onClick={getLocation} variant="destructive" className="mt-4">
              {t('tryAgainButton')}
            </Button>
          </div>
        )}

        {locationState.status === 'success' && locationState.coords && (
          <div>
            <div className="mb-4 rounded-lg bg-primary/10 p-4">
              <p className="font-semibold text-primary flex items-center">
                <MapPin className="mr-2 inline-block h-4 w-4" />
                {locationState.locationName || t('locationFound')}
              </p>
              <p className="font-mono text-sm text-primary/80 mt-1">
                {t('lat')}: {locationState.coords.latitude.toFixed(4)}, {t('lon')}: {locationState.coords.longitude.toFixed(4)}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold font-headline">{t('suggestionsTitle')}</h3>
              <p className="text-muted-foreground text-sm mb-4">{t('suggestionsDescription')}</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <span className="font-semibold">{t('crops.corn.name')}:</span> {t('crops.corn.description')}
                </li>
                <li>
                  <span className="font-semibold">{t('crops.soybeans.name')}:</span> {t('crops.soybeans.description')}
                </li>
                <li>
                  <span className="font-semibold">{t('crops.wheat.name')}:</span> {t('crops.wheat.description')}
                </li>
                 <li>
                  <span className="font-semibold">{t('crops.potatoes.name')}:</span> {t('crops.potatoes.description')}
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
