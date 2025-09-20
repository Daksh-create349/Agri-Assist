'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, Droplets } from 'lucide-react';

import {
  recommendFertilizers,
  type RecommendFertilizersOutput,
} from '@/ai/flows/recommend-fertilizers';
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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<RecommendFertilizersOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: '',
      soilConditions: '',
      region: '',
    },
  });

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
        title: 'Error',
        description: 'Failed to get fertilizer recommendations. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Crop & Soil Details</CardTitle>
          <CardDescription>
            Provide information about your crop and soil to get optimal fertilizer recommendations.
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
                    <FormLabel>Crop Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Corn, Wheat, Tomatoes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soilConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Low in nitrogen, pH of 6.2, good drainage"
                        {...field}
                        rows={4}
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
                    <FormLabel>Geographical Region</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Midwest, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Recommend Fertilizers
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
              <p className="text-lg font-semibold">Calculating recommendations...</p>
              <p className="text-muted-foreground">Our AI is tailoring suggestions for you.</p>
            </CardContent>
          </Card>
        )}
        {aiResponse && (
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Droplets /> Fertilizer Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Recommendations</h3>
                <p className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap">{aiResponse.fertilizerRecommendations}</p>
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
