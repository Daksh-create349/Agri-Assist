'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, ThumbsUp, Leaf, Tractor } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
  suggestCrops,
  type SuggestCropsInput,
  type SuggestCropsOutput,
} from '@/ai/flows/suggest-crops-based-on-soil';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const formSchema = z.object({
  location: z.string().min(2, 'Please enter a valid location.'),
  climateConditions: z.string().min(10, 'Please describe the climate conditions.'),
  phLevel: z.string().optional(),
  nitrogen: z.string().optional(),
  phosphorus: z.string().optional(),
  potassium: z.string().optional(),
  overallHealth: z.string().optional(),
  soilTexture: z.string().optional(),
  farmlandArea: z.coerce.number().positive('Please enter a valid area.').optional(),
  farmlandUnit: z.enum(['hectares', 'acres']).default('acres'),
});

type FormData = z.infer<typeof formSchema>;

function CropRecommendationFormComponent() {
  const t = useTranslations('CropRecommendation');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<SuggestCropsOutput | null>(null);
  const searchParams = useSearchParams();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      climateConditions: '',
      phLevel: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      overallHealth: '',
      soilTexture: '',
      farmlandArea: '' as unknown as number,
      farmlandUnit: 'acres',
    },
  });

  async function onSubmit(values: SuggestCropsInput) {
    setIsSubmitting(true);
    setAiResponse(null);
    try {
      const response = await suggestCrops(values);
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

  useEffect(() => {
    const location = searchParams.get('location');
    const climateConditions = searchParams.get('climateConditions');
    const phLevel = searchParams.get('phLevel');
    const nitrogen = searchParams.get('nitrogen');
    const phosphorus = searchParams.get('phosphorus');
    const potassium = searchParams.get('potassium');
    const overallHealth = searchParams.get('overallHealth');
    
    if (location && climateConditions) {
      const values: SuggestCropsInput = {
        location,
        climateConditions,
        phLevel: phLevel || undefined,
        nitrogen: nitrogen || undefined,
        phosphorus: phosphorus || undefined,
        potassium: potassium || undefined,
        overallHealth: overallHealth || undefined,
      };
      form.reset(values as FormData);
      onSubmit(values);
    }
  }, [searchParams, form]);


  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('form.title')}</CardTitle>
          <CardDescription>{t('form.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>{t('form.locationLabel')}</FormLabel>
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
                    <FormItem className="sm:col-span-2">
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
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                    control={form.control}
                    name="farmlandArea"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('form.farmlandAreaLabel')}</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder={t('form.farmlandAreaPlaceholder')} {...field} />
                        </FormControl>
                         <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="farmlandUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.unitLabel')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('form.unitPlaceholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="acres">{t('form.acres')}</SelectItem>
                          <SelectItem value="hectares">{t('form.hectares')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-sm font-medium text-muted-foreground">{t('form.soilDetailsOptional')}</p>
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                 <FormField
                  control={form.control}
                  name="phLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.phLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('form.phPlaceholder')} {...field} />
                      </FormControl>
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
                        <Input placeholder={t('form.nitrogenPlaceholder')} {...field} />
                      </FormControl>
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
                        <Input placeholder={t('form.phosphorusPlaceholder')} {...field} />
                      </FormControl>
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
                        <Input placeholder={t('form.potassiumPlaceholder')} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
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
                <ThumbsUp /> {t('results.title')}
              </CardTitle>
               <CardDescription>
                {t('results.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('results.tableCrop')}</TableHead>
                    <TableHead className="text-right">{t('results.tableSeedPrice')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiResponse.suggestedCrops.map((crop) => (
                    <TableRow key={crop.name}>
                      <TableCell className="font-medium flex items-center gap-2"><Leaf className="h-4 w-4 text-primary/80"/>{crop.name}</TableCell>
                      <TableCell className="text-right font-mono">Rs {crop.seedPrice.toFixed(2)} <span className="text-xs text-muted-foreground">{crop.priceUnit}</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
         {!isSubmitting && !aiResponse && (
          <Card className="flex h-full min-h-96 flex-col items-center justify-center border-dashed">
            <CardContent className="text-center text-muted-foreground">
                <Tractor className="mx-auto mb-4 h-12 w-12" />
                <p className="text-lg font-semibold">{t('results.idleTitle')}</p>
                <p>{t('results.idleDescription')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Suspense Boundary
import { Suspense } from 'react';

export function CropRecommendationForm() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CropRecommendationFormComponent />
        </Suspense>
    )
}
