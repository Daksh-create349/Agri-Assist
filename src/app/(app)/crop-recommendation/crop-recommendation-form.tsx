
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, ThumbsUp, Leaf } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  location: z.string().min(2, 'Please enter a valid location.'),
  climateConditions: z.string().min(10, 'Please describe the climate conditions.'),
  phLevel: z.string().optional(),
  nitrogen: z.string().optional(),
  phosphorus: z.string().optional(),
  potassium: z.string().optional(),
  overallHealth: z.string().optional(),
  soilTexture: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function CropRecommendationFormComponent() {
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
        title: 'Error',
        description: 'Failed to get crop recommendations. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    // This function will run only once when the component mounts.
    const location = searchParams.get('location');
    const climateConditions = searchParams.get('climateConditions');
    const phLevel = searchParams.get('phLevel');
    const nitrogen = searchParams.get('nitrogen');
    const phosphorus = searchParams.get('phosphorus');
    const potassium = searchParams.get('potassium');
    const overallHealth = searchParams.get('overallHealth');
    
    // Check if at least location and climate are present to trigger auto-submission
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
      form.reset(values);
      onSubmit(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, form.reset]);


  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Farm Details</CardTitle>
          <CardDescription>
            Provide information about your farm to get tailored crop recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geographical Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Central Valley, California" {...field} />
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
                    <FormLabel>Climate Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Hot, dry summers with mild, wet winters. Average rainfall 20 inches."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-sm font-medium text-muted-foreground">Soil Details (Optional)</p>
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                 <FormField
                  control={form.control}
                  name="phLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>pH Level</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 6.5" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="nitrogen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nitrogen (ppm)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 25" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="phosphorus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phosphorus (ppm)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 50" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="potassium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Potassium (ppm)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 150" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Recommendations...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Recommendations
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
              <p className="text-lg font-semibold">Analyzing your data...</p>
              <p className="text-muted-foreground">Our AI is finding the best crops for you.</p>
            </CardContent>
          </Card>
        )}
        {aiResponse && (
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <ThumbsUp /> AI-Powered Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2"><Leaf/> Suggested Crops</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                    {aiResponse.suggestedCrops.map((crop) => (
                        <div key={crop.trim()} className="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary-foreground">
                            {crop.trim()}
                        </div>
                    ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Reasoning</h3>
                <p className="mt-2 text-sm text-foreground/80">{aiResponse.reasoning}</p>
              </div>
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
