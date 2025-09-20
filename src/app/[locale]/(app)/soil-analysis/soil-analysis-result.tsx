'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, FlaskConical, Lightbulb, TrendingDown, TrendingUp, Minus, Leaf } from 'lucide-react';
import type { AnalyzeSoilDataOutput } from '@/ai/flows/analyze-soil-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

type SoilAnalysisResultProps = {
  result: AnalyzeSoilDataOutput;
  location: string;
  climateConditions: string;
};

const NutrientStatusIcon = ({ status }: { status: string }) => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('low')) return <TrendingDown className="h-5 w-5 text-destructive" />;
  if (lowerStatus.includes('high')) return <TrendingUp className="h-5 w-5 text-amber-500" />;
  if (lowerStatus.includes('optimal')) return <CheckCircle className="h-5 w-5 text-primary" />;
  return <Minus className="h-5 w-5 text-muted-foreground" />;
};

const getStatusVariant = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('low')) return 'destructive' as const;
    if (lowerStatus.includes('high')) return 'secondary' as const;
    if (lowerStatus.includes('optimal')) return 'default' as const;
    return 'outline' as const;
}

export function SoilAnalysisResult({ result, location, climateConditions }: SoilAnalysisResultProps) {
  const t = useTranslations('SoilAnalysis.results');
  const router = useRouter();
  const { overallHealth, recommendations, nutrientAnalysis } = result;
  
  const nutrients = [
      { name: 'pH Level', ...nutrientAnalysis.ph },
      { name: t('nutrientpH'), ...nutrientAnalysis.ph },
      { name: t('nutrientNitrogen'), ...nutrientAnalysis.nitrogen },
      { name: t('nutrientPhosphorus'), ...nutrientAnalysis.phosphorus },
      { name: t('nutrientPotassium'), ...nutrientAnalysis.potassium },
  ]
  
  const handleSuggestCrops = () => {
    const queryParams = new URLSearchParams({
      location: location,
      climateConditions: climateConditions,
      phLevel: nutrientAnalysis.ph.value,
      nitrogen: nutrientAnalysis.nitrogen.value,
      phosphorus: nutrientAnalysis.phosphorus.value,
      potassium: nutrientAnalysis.potassium.value,
      overallHealth: overallHealth,
    });

    router.push(`/crop-recommendation?${queryParams.toString()}`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <FlaskConical /> {t('title')}
          </CardTitle>
          <CardDescription>{overallHealth}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">{t('nutrientBreakdown')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nutrients.map((nutrient) => (
                  <Card key={nutrient.name} className="bg-card/80">
                      <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center justify-between">
                              {nutrient.name}
                              <NutrientStatusIcon status={nutrient.status}/>
                          </CardTitle>
                          <div className="text-2xl font-bold text-foreground pt-1">{nutrient.value}</div>
                      </CardHeader>
                      <CardContent>
                           <Badge variant={getStatusVariant(nutrient.status)}>{nutrient.status}</Badge>
                           <p className="text-xs text-muted-foreground mt-2">{nutrient.advice}</p>
                      </CardContent>
                  </Card>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Lightbulb /> {t('recommendations')}
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-foreground/80">
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSuggestCrops}>
                <Leaf className="mr-2 h-4 w-4" />
                {t('getCropSuggestionsButton')}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
