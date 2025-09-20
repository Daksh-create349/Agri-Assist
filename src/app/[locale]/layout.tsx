'use client';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Logo } from '@/components/logo';
import { Skeleton } from '@/components/ui/skeleton';

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error('Failed to load messages for locale:', locale, error);
    return (await import(`../../../messages/en.json`)).default;
  }
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    getMessages(locale).then(setMessages);
  }, [locale]);

  if (!messages) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="w-full max-w-md space-y-4 p-4">
          <div className="flex items-center space-x-2 justify-center">
            <Logo />
          </div>
          <p className="text-center text-muted-foreground">
            Loading your experience...
          </p>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
