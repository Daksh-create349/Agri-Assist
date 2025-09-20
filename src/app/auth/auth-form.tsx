'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, UploadCloud, FileCheck2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { extractAadharDetails } from '@/ai/flows/extract-aadhar-details';

const loginSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name.'),
  aadharNumber: z.string().regex(/^\d{4}\s\d{4}\s\d{4}$/, 'Please enter a valid 12-digit Aadhar number.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export function AuthForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      fullName: '',
      aadharNumber: '',
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onLogin(values: LoginFormData) {
    setIsSubmitting(true);
    // Bypass authentication for demo
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  }

  async function onSignUp(values: SignUpFormData) {
    setIsSubmitting(true);
    // Bypass authentication for demo
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  }
  
  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAadharFile(file);
      setIsScanning(true);
      try {
        const photoDataUri = await fileToDataUri(file);
        const details = await extractAadharDetails({ photoDataUri });
        loginForm.setValue('fullName', details.fullName, { shouldValidate: true });
        loginForm.setValue('aadharNumber', details.aadharNumber, { shouldValidate: true });
        toast({
          title: 'Details Extracted',
          description: "We've filled in your name and Aadhar number.",
        });
      } catch (error) {
        console.error("Aadhar scan failed", error);
        toast({
          variant: 'destructive',
          title: 'Scan Failed',
          description: 'Could not extract details from the image. Please enter them manually.',
        });
      } finally {
        setIsScanning(false);
      }
    }
  };


  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onLogin)}
            className="space-y-4 pt-4"
          >
            <div className="space-y-2">
                <FormLabel>Upload Aadhar Card</FormLabel>
                <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                >
                    {isScanning ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : aadharFile ? (
                        <FileCheck2 className="mr-2 h-4 w-4 text-primary" />
                    ) : (
                        <UploadCloud className="mr-2 h-4 w-4" />
                    )}
                    <span>{isScanning ? 'Scanning...' : aadharFile ? aadharFile.name : 'Upload Photo'}</span>
                </Button>
                <p className="text-xs text-center text-muted-foreground">We'll scan your name and Aadhar number.</p>
            </div>
            
            <FormField
              control={loginForm.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={loginForm.control}
              name="aadharNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhar Number</FormLabel>
                  <FormControl>
                    <Input placeholder="XXXX XXXX XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || isScanning} className="w-full">
              {(isSubmitting || isScanning) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Login
            </Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="signup">
        <Form {...signUpForm}>
          <form
            onSubmit={signUpForm.handleSubmit(onSignUp)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={signUpForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Up
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
