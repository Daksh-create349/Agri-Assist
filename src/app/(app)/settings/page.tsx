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
import { LogIn, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const router = useRouter();
  const { setTheme, theme } = useTheme();

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
      <div className="grid gap-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Switch between light and dark mode.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
              >
                <Sun className="mr-2" /> Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
              >
                <Moon className="mr-2" /> Dark
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
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
      </div>
    </main>
  );
}
