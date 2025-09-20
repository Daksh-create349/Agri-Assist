'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

export function SoilAnalysisForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const resetSelection = () => {
    setFile(null);
    setPreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Soil Data</CardTitle>
        <CardDescription>
          You can either upload a file or manually enter the key
          characteristics of your soil.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Test Results</Label>
            <Input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            {preview ? (
              <div className="relative group w-full max-w-sm rounded-lg border border-border overflow-hidden">
                <Image
                  src={preview}
                  alt="Soil report preview"
                  width={400}
                  height={300}
                  className="object-contain"
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
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
                      Click the button to upload a photo of your soil report.
                    </p>
                    <Button type="button" variant="outline" onClick={handleUploadClick} className="mt-4">
                      <Upload className="mr-2 h-4 w-4" />
                      Select File
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
                Or enter manually
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ph-level">pH Level</Label>
              <Input id="ph-level" placeholder="e.g., 6.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organic-matter">Organic Matter (%)</Label>
              <Input id="organic-matter" placeholder="e.g., 3.1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nitrogen">Nitrogen (ppm)</Label>
              <Input id="nitrogen" placeholder="e.g., 20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phosphorus">Phosphorus (ppm)</Label>
              <Input id="phosphorus" placeholder="e.g., 50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="potassium">Potassium (ppm)</Label>
              <Input id="potassium" placeholder="e.g., 150" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="texture">Soil Texture</Label>
              <Input id="texture" placeholder="e.g., Loamy Sand" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any other observations or details..."
            />
          </div>

          <Button type="submit">Analyze Soil</Button>
        </form>
      </CardContent>
    </Card>
  );
}
