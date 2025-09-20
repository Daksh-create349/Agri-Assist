'use client';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/lib/firebase/client-app';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { SidebarNav } from '@/components/sidebar-nav';
import { Skeleton } from '@/components/ui/skeleton';

// This is a temporary function to satisfy the async requirement of getMessages
// In a real app, you might fetch messages differently or handle this with more robust loading states
async function getMessagesForLocale(locale: string) {
  try {
    // The dynamic import wraps the object in a { default: ... } structure
    const messagesModule = await import(`../../../messages/${locale}.json`);
    return messagesModule.default;
  } catch (error) {
    console.error('Failed to load messages for locale:', locale, error);
    // Fallback to English if the requested locale is not found
    const fallbackModule = await import(`../../../messages/en.json`);
    return fallbackModule.default;
  }
}


export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Changed to false to bypass auth check
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    async function loadMessages() {
      const msgs = await getMessagesForLocale(locale);
      setMessages(msgs);
    }
    loadMessages();
  }, [locale]);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setUser(user);
  //     } else {
  //       router.push('/auth');
  //     }
  //     setLoading(false);
  //   });
  //   return () => unsubscribe();
  // }, [router]);

  if (loading || !messages) {
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

  // if (!user) { // Bypass user check
  //   return null;
  // }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
       <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6 md:hidden">
            <SidebarTrigger />
            <Logo />
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </NextIntlClientProvider>
  );
}
