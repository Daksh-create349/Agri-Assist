'use client';
import { NextIntlClientProvider } from 'next-intl';
import { Inter } from 'next/font/google';
import * as React from 'react';

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error('Failed to load messages for locale:', locale, error);
    // Fallback to English if the locale is not found
    return (await import(`../../../messages/en.json`)).default;
  }
}

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const [messages, setMessages] = React.useState(null);

  React.useEffect(() => {
    getMessages(locale).then(setMessages);
  }, [locale]);

  if (!messages) {
    // You can render a loading skeleton here
    return (
      <html lang={locale}>
        <body className={inter.className}>
          <div>Loading...</div>
        </body>
      </html>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}