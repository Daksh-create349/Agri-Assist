'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Upload, X, TestTube, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  analyzeSoilData,
  type AnalyzeSoilDataOutput,
} from '@/ai/flows/analyze-soil-data';
import { getLocationNameFromCoords } from '@/ai/flows/get-location-name-from-coords';
import { getClimateConditionsFromCoords } from '@/ai/flows/get-climate-conditions-from-coords';
import { SoilAnalysisResult } from './soil-analysis-result';

const formSchema = z.object({
  phLevel: z.string().optional(),
  organicMatter: z.string().optional(),
  nitrogen: z.string().optional(),
  phosphorus: z.string().optional(),
  potassium: z.string().optional(),
  texture: z.string().optional(),
  notes: z.string().optional(),
  location: z.string().min(2, 'Please enter a valid location.'),
  climateConditions: z.string().min(10, 'Please describe the climate conditions.'),
});

type FormData = z.infer<typeof formSchema>;

export function SoilAnalysisForm() {
  const t = useTranslations('SoilAnalysis');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [aiResponse, setAiResponse] = useState<AnalyzeSoilDataOutput | null>(
    null
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phLevel: '',
      organicMatter: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      texture: '',
      notes: '',
      location: '',
      climateConditions: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: FormData) {
    if (!file && !values.phLevel && !values.nitrogen && !values.phosphorus && !values.potassium) {
      toast({
        variant: 'destructive',
        title: t('toast.noDataTitle'),
        description: t('toast.noDataDescription'),
      });
      return;
    }
    setIsSubmitting(true);
    setAiResponse(null);
    try {
      const photoDataUri = file ? await fileToDataUri(file) : undefined;
      const { location, climateConditions, ...soilValues } = values;
      const response = await analyzeSoilData({ ...soilValues, photoDataUri });
      setAiResponse(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('toast.errorTitle'),
        description: t('toast.errorDescription'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const resetSelection = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
       toast({
        variant: 'destructive',
        title: t('toast.geolocationNotSupportedTitle'),
        description: t('toast.geolocationNotSupportedDescription'),
      });
      return;
    }
    
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
           const { latitude, longitude } = position.coords;

           const locationPromise = getLocationNameFromCoords({ latitude, longitude });
           const climatePromise = getClimateConditionsFromCoords({ latitude, longitude });
           
           const [locationResponse, climateResponse] = await Promise.all([locationPromise, climatePromise]);
           
           form.setValue('location', locationResponse.locationName, { shouldValidate: true });
           form.setValue('climateConditions', climateResponse.climateConditions, { shouldValidate: true });

           toast({
              title: t('toast.locationFoundTitle'),
              description: t('toast.locationFoundDescription', { locationName: locationResponse.locationName }),
           });
        } catch (error) {
            console.error('Failed to get location info', error);
            toast({
                variant: 'destructive',
                title: t('toast.fetchLocationErrorTitle'),
                description: t('toast.fetchLocationErrorDescription'),
            });
        } finally {
            setIsFetchingLocation(false);
        }
      },
      () => {
        toast({
            variant: 'destructive',
            title: t('toast.locationAccessDeniedTitle'),
            description: t('toast.locationAccessDeniedDescription'),
        });
        setIsFetchingLocation(false);
      }
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('form.title')}</CardTitle>
          <CardDescription>
            {t('form.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <FormLabel>{t('form.uploadLabel')}</FormLabel>
                <Input
                  id="file-upload"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                {preview ? (
                  <div className="group relative w-full max-w-sm overflow-hidden rounded-lg border border-border">
                    <Image
                      src={preview}
                      alt={t('form.previewAlt')}
                      width={400}
                      height={300}
                      className="object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={resetSelection}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        {t('form.uploadText')}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleUploadClick}
                        className="mt-4"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {t('form.selectFileButton')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {t('form.orEnterManually')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.phLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 6.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organicMatter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.organicMatterLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nitrogen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.nitrogenLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phosphorus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.phosphorusLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="potassium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.potassiumLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 150" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="texture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.textureLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('form.texturePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.notesLabel')}</FormLabel>
                      <FormControl>
                          <Textarea
                            id="notes"
                            placeholder={t('form.notesPlaceholder')}
                            {...field}
                          />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
               <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {t('form.locationAndClimate')}
                  </span>
                </div>
              </div>

               <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{t('form.locationLabel')}</FormLabel>
                       <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-xs"
                        onClick={handleGetLocation}
                        disabled={isFetchingLocation}
                      >
                         {isFetchingLocation ? (
                          <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            {t('form.fetchingLocationButton')}
                          </>
                        ) : (
                          <>
                           <MapPin className="mr-1 h-3 w-3" />
                           {t('form.useMyLocationButton')}
                          </>
                        )}
                      </Button>
                    </div>
                    <FormControl>
                      <Input placeholder={t('form.locationPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="climateConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.climateLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('form.climatePlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" disabled={isSubmitting}>
                 {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('form.submittingButton')}
                  </>
                ) : (
                  <>
                    <TestTube className="mr-2 h-4 w-4" />
                    {t('form.submitButton')}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="space-y-6">
        {isSubmitting && (
           <Card className="flex h-full min-h-96 flex-col items-center justify-center">
            <CardContent className="text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-semibold">{t('results.loadingTitle')}</p>
              <p className="text-muted-foreground">{t('results.loadingDescription')}</p>
            </CardContent>
          </Card>
        )}
        {aiResponse && <SoilAnalysisResult result={aiResponse} location={form.getValues('location')} climateConditions={form.getValues('climateConditions')} />}
      </div>
    </div>
  );
}
