import { HorizontalNav } from '@/components/horizontal-nav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <HorizontalNav />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
