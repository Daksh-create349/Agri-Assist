'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';


export default function Home() {
  const router = useRouter();
  const t = useTranslations('Home');

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-background p-4">
      <div className="flex items-center space-x-2">
        <Logo />
      </div>
      <p className="text-muted-foreground">{t('loading')}</p>
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
