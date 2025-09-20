
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, FlaskConical, Lightbulb, TrendingDown, TrendingUp, Minus, Leaf, Loader2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';

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
  const router = useRouter();
  const { overallHealth, recommendations, nutrientAnalysis } = result;
  
  const nutrients = [
      { name: 'pH Level', ...nutrientAnalysis.ph },
      { name: 'Nitrogen', ...nutrientAnalysis.nitrogen },
      { name: 'Phosphorus', ...nutrientAnalysis.phosphorus },
      { name: 'Potassium', ...nutrientAnalysis.potassium },
  ]
  
  const handleSuggestCrops = () => {
    const soilDataString = `Overall Health: ${overallHealth}. Recommendations: ${recommendations.join(', ')}. Nutrient Analysis: ${JSON.stringify(nutrientAnalysis)}`;
    
    const queryParams = new URLSearchParams({
      soilData: soilDataString,
      location: location,
      climateConditions: climateConditions,
    });

    router.push(`/crop-recommendation?${queryParams.toString()}`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <FlaskConical /> AI Soil Analysis Report
          </CardTitle>
          <CardDescription>{overallHealth}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Nutrient Breakdown</h3>
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
              <Lightbulb /> Recommendations
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
                Get Crop Suggestions
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
