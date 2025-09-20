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
import { Upload } from 'lucide-react';

export default function SoilAnalysisPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Soil Analysis
        </h1>
        <p className="text-muted-foreground">
          Enter or upload your soil test results for a detailed breakdown.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Soil Data</CardTitle>
          <CardDescription>
            You can either upload a file or manually enter the key characteristics of your soil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload Test Results</Label>
              <div className="flex items-center gap-2">
                 <Input id="file-upload" type="file" className="flex-grow"/>
                 <Button type="button" variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload</Button>
              </div>
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
              <Textarea id="notes" placeholder="Any other observations or details..." />
            </div>

            <Button type="submit">Analyze Soil</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
