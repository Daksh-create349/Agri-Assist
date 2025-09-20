'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, Droplets, Upload, X, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  recommendFertilizers,
  type RecommendFertilizersOutput,
} from '@/ai/flows/recommend-fertilizers';
import { inferSoilConditionsFromCropImage } from '@/ai/flows/infer-soil-conditions-from-crop-image';
import { getLocationNameFromCoords } from '@/ai/flows/get-location-name-from-coords';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  crop: z.string().min(2, 'Please enter a valid crop type.'),
  soilConditions: z.string().min(10, 'Please describe your soil conditions.'),
  region: z.string().min(2, 'Please enter your geographical region.'),
});

type FormData = z.infer<typeof formSchema>;

export function FertilizerRecommendationForm() {
  const t = useTranslations('FertilizerRecommendation');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [aiResponse, setAiResponse] = useState<RecommendFertilizersOutput | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: '',
      soilConditions: '',
      region: '',
    },
  });

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      await analyzeImage(selectedFile);
    }
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzingImage(true);
    form.setValue('soilConditions', t('form.analyzingImage'));
    try {
      const photoDataUri = await fileToDataUri(file);
      const { soilConditions } = await inferSoilConditionsFromCropImage({ photoDataUri });
      form.setValue('soilConditions', soilConditions, { shouldValidate: true });
      toast({
        title: t('toast.imageAnalyzedTitle'),
        description: t('toast.imageAnalyzedDescription'),
      });
    } catch (error) {
      console.error('Failed to analyze image', error);
      form.setValue('soilConditions', t('form.analysisFailed'), { shouldValidate: true });
      toast({
        variant: 'destructive',
        title: t('toast.analysisFailedTitle'),
        description: t('toast.analysisFailedDescription'),
      });
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    setAiResponse(null);
    try {
      const response = await recommendFertilizers(values);
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
          const { locationName } = await getLocationNameFromCoords({ latitude, longitude });
          form.setValue('region', locationName, { shouldValidate: true });
          toast({
            title: t('toast.locationFoundTitle'),
            description: t('toast.locationFoundDescription', { locationName }),
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
    );
  };

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
              <FormField
                control={form.control}
                name="crop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.cropTypeLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.cropTypePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>{t('form.uploadPhotoLabel')}</FormLabel>
                <p className="text-sm text-muted-foreground">{t('form.uploadPhotoDescription')}</p>
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
                      alt={t('form.cropPreviewAlt')}
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
                        {t('form.selectImageButton')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="soilConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.soilConditionsLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('form.soilConditionsPlaceholder')}
                        {...field}
                        rows={4}
                        disabled={isAnalyzingImage}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                     <div className="flex items-center justify-between">
                      <FormLabel>{t('form.regionLabel')}</FormLabel>
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
                      <Input placeholder={t('form.regionPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting || isAnalyzingImage}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('form.submittingButton')}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
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
        {aiResponse && (
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Droplets /> {t('results.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{t('results.recommendations')}</h3>
                <p className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap">{aiResponse.fertilizerRecommendations}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('results.reasoning')}</h3>
                <p className="mt-2 text-sm text-foreground/80">{aiResponse.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
