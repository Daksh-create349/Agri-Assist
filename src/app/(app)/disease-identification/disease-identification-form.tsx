'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Loader2, Sparkles, Upload, AlertTriangle, ShieldCheck, Percent, Lightbulb } from 'lucide-react';

import { identifyCropDiseaseFromImage, type IdentifyCropDiseaseFromImageOutput } from '@/ai/flows/identify-crop-disease-from-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export function DiseaseIdentificationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<IdentifyCropDiseaseFromImageOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setAiResponse(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  async function handleSubmit() {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload an image of the crop.',
      });
      return;
    }

    setIsSubmitting(true);
    setAiResponse(null);
    try {
      const photoDataUri = await fileToDataUri(file);
      const response = await identifyCropDiseaseFromImage({ photoDataUri });
      setAiResponse(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to identify disease. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload Crop Image</CardTitle>
          <CardDescription>
            Select a clear photo of the affected crop for analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-border p-8 text-center">
            {preview ? (
              <div className="relative h-48 w-48 overflow-hidden rounded-lg">
                <Image src={preview} alt="Crop preview" fill className="object-cover" />
              </div>
            ) : (
              <Upload className="h-12 w-12 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">
              {file ? file.name : 'Drag & drop or click to upload'}
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button type="button" variant="outline" onClick={handleButtonClick}>
              Choose Image
            </Button>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting || !file} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Identify Disease
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {isSubmitting && (
           <Card className="flex h-full min-h-96 flex-col items-center justify-center">
            <CardContent className="text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-semibold">Analyzing your image...</p>
              <p className="text-muted-foreground">Our AI is looking for signs of disease.</p>
            </CardContent>
          </Card>
        )}
        {aiResponse && (
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <ShieldCheck /> AI Diagnosis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2"><AlertTriangle/> Likely Disease</h3>
                <p className="mt-1 text-2xl font-bold text-primary">{aiResponse.diseaseIdentification.likelyDisease}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2"><Percent/> Confidence Level</h3>
                <div className="flex items-center gap-2">
                    <Progress value={aiResponse.diseaseIdentification.confidenceLevel * 100} className="w-full" />
                    <span className="font-mono text-lg font-semibold text-primary">
                        {(aiResponse.diseaseIdentification.confidenceLevel * 100).toFixed(0)}%
                    </span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2"><Lightbulb/> Possible Solutions</h3>
                <p className="mt-2 text-sm text-foreground/80">{aiResponse.diseaseIdentification.possibleSolutions}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
