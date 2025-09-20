'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Logo } from '@/components/logo';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 2000); // Wait for 2 seconds to show animation
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-background p-4 overflow-hidden">
      <div className="animate-fade-in-rise flex flex-col items-center justify-center gap-4">
        <Logo className="scale-150" />
        <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">
          AgriAssist
        </h1>
      </div>
      <p className="text-muted-foreground animate-fade-in-rise animation-delay-500">
        Loading your experience...
      </p>
    </div>
  );
}
