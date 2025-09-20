'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, Wand, CheckCircle, Lightbulb } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  boostMarketplaceRanking,
  type OfferAttractivenessOutput,
} from '@/ai/flows/boost-marketplace-ranking';
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
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  adCopy: z.string().min(10, 'Please provide ad copy for analysis.'),
  productDescription: z.string().min(20, 'Please provide a detailed product description.'),
  targetAudience: z.string().min(3, 'Please specify your target audience.'),
});

type FormData = z.infer<typeof formSchema>;

export function MarketplaceBoostForm() {
  const t = useTranslations('MarketplaceBoost');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<OfferAttractivenessOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adCopy: '',
      productDescription: '',
      targetAudience: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    setAiResponse(null);
    try {
      const response = await boostMarketplaceRanking(values);
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
                name="adCopy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.adCopyLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.adCopyPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.productDescriptionLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('form.productDescriptionPlaceholder')}
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.targetAudienceLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.targetAudiencePlaceholder')} {...field} />
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
                    <Wand className="mr-2 h-4 w-4" />
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
                <CheckCircle /> {t('results.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg">{t('results.attractivenessScore')}</h3>
                <div className="flex items-center gap-4 mt-2">
                    <Progress value={aiResponse.attractivenessScore * 100} className="w-full" />
                    <span className="font-mono text-2xl font-semibold text-primary">
                        {(aiResponse.attractivenessScore * 100).toFixed(0)}
                        <span className="text-sm">/100</span>
                    </span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2"><Lightbulb /> {t('results.suggestions')}</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-foreground/80">
                  {aiResponse.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
