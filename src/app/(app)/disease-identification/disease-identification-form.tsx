'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, Sparkles, Upload, AlertTriangle, ShieldCheck, Percent, Lightbulb, Camera, Video, FileUp } from 'lucide-react';

import { identifyCropDiseaseFromImage, type IdentifyCropDiseaseFromImageOutput } from '@/ai/flows/identify-crop-disease-from-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export function DiseaseIdentificationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<IdentifyCropDiseaseFromImageOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    // Clean up camera stream when component unmounts or camera is deactivated
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const getCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
       setHasCameraPermission(false);
       toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this feature.',
      });
    }
  };
  
  const stopCamera = () => {
     if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
     }
     setIsCameraActive(false);
  }

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
  
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/png');
        setPreview(dataUri);
        setFile(dataURLtoFile(dataUri, `capture-${Date.now()}.png`));
        setAiResponse(null);
        stopCamera();
      }
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
        title: 'No image selected',
        description: 'Please upload or capture an image of the crop.',
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
  
  const resetSelection = () => {
    setPreview(null);
    setFile(null);
    setAiResponse(null);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Provide Crop Image</CardTitle>
          <CardDescription>
            Upload a photo or use your camera to capture an image of the affected crop.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
         {preview ? (
            <div className="space-y-4 text-center">
              <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-lg">
                <Image src={preview} alt="Crop preview" fill className="object-cover" />
              </div>
              <Button onClick={resetSelection} variant="outline">Choose another image</Button>
            </div>
          ) : (
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" onClick={stopCamera}><FileUp className="mr-2"/> Upload File</TabsTrigger>
                <TabsTrigger value="camera" onClick={getCameraPermission}><Camera className="mr-2"/> Use Camera</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-border p-8 text-center mt-4">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
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
              </TabsContent>
              <TabsContent value="camera">
                <div className="space-y-4 rounded-lg border-2 border-dashed border-border p-4 text-center mt-4">
                  {hasCameraPermission === false && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Camera Access Denied</AlertTitle>
                      <AlertDescription>
                        Please enable camera permissions to use this feature.
                      </AlertDescription>
                    </Alert>
                  )}
                  <video ref={videoRef} className={cn("w-full aspect-video rounded-md", !isCameraActive && 'hidden')} autoPlay muted playsInline />
                  <canvas ref={canvasRef} className="hidden" />
                  {isCameraActive && (
                    <Button onClick={handleCapture} className="w-full">
                      <Camera className="mr-2 h-4 w-4" />
                      Take Picture
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

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
