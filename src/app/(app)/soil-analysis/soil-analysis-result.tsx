
'use client';

import { useState } from 'react';
import { CheckCircle, FlaskConical, Lightbulb, TrendingDown, TrendingUp, Minus, Leaf, Loader2 } from 'lucide-react';
import type { AnalyzeSoilDataOutput } from '@/ai/flows/analyze-soil-data';
import { suggestCrops, type SuggestCropsOutput } from '@/ai/flows/suggest-crops-based-on-soil';
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
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
  const { overallHealth, recommendations, nutrientAnalysis } = result;
  const [cropResponse, setCropResponse] = useState<SuggestCropsOutput | null>(null);
  const [isSuggestingCrops, setIsSuggestingCrops] = useState(false);
  
  const nutrients = [
      { name: 'pH Level', ...nutrientAnalysis.ph },
      { name: 'Nitrogen', ...nutrientAnalysis.nitrogen },
      { name: 'Phosphorus', ...nutrientAnalysis.phosphorus },
      { name: 'Potassium', ...nutrientAnalysis.potassium },
  ]
  
  const handleSuggestCrops = async () => {
    setIsSuggestingCrops(true);
    setCropResponse(null);
    try {
      const soilDataString = `Overall Health: ${overallHealth}. Recommendations: ${recommendations.join(', ')}. Nutrient Analysis: ${JSON.stringify(nutrientAnalysis)}`;
      const response = await suggestCrops({
        soilData: soilDataString,
        location,
        climateConditions,
      });
      setCropResponse(response);
    } catch (error) {
      console.error('Failed to get crop suggestions', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get crop suggestions. Please try again.',
      });
    } finally {
      setIsSuggestingCrops(false);
    }
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
            <Button onClick={handleSuggestCrops} disabled={isSuggestingCrops}>
                {isSuggestingCrops ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Getting Suggestions...
                    </>
                ) : (
                    <>
                        <Leaf className="mr-2 h-4 w-4" />
                        Get Crop Suggestions
                    </>
                )}
            </Button>
        </CardFooter>
      </Card>
      
      {isSuggestingCrops && (
         <Card className="flex h-full min-h-64 flex-col items-center justify-center">
          <CardContent className="text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-semibold">Finding suitable crops...</p>
            <p className="text-muted-foreground">Our AI is analyzing your soil report and location.</p>
          </CardContent>
        </Card>
      )}

      {cropResponse && (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Leaf /> Crop Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Suggested Crops</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                  {cropResponse.suggestedCrops.split(',').map((crop) => (
                      <div key={crop.trim()} className="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary-foreground">
                          {crop.trim()}
                      </div>
                  ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Reasoning</h3>
              <p className="mt-2 text-sm text-foreground/80">{cropResponse.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
