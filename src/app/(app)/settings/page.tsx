
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LogIn, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/auth');
  };

  const handleLogout = () => {
    // In a real app, you would call your sign-out function here.
    // For this demo, we just redirect to the auth page.
    router.push('/auth');
  };

  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Manage your session by logging in or out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleLogin} className="w-full">
            <LogIn className="mr-2" /> Login
          </Button>
          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut className="mr-2" /> Logout
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
