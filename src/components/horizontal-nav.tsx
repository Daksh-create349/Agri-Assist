'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FlaskConical,
  Leaf,
  MapPin,
  Scan,
  Store,
  TestTube,
  TrendingUp,
  LayoutDashboard,
  Settings,
  Menu,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function HorizontalNav() {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();

  const getActivePath = (path: string) => {
    // This function checks if the current pathname (e.g., /en/dashboard) ends with the link's href
    return pathname.endsWith(path);
  };

  const links = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/soil-analysis', label: t('soilAnalysis'), icon: TestTube },
    {
      href: '/crop-recommendation',
      label: t('cropRecommendation'),
      icon: Leaf,
    },
    { href: '/disease-identification', label: t('diseaseId'), icon: Scan },
    {
      href: '/fertilizer-recommendation',
      label: t('fertilizerRecs'),
      icon: FlaskConical,
    },
    { href: '/crop-guidance', label: t('cropGuidance'), icon: MapPin },
    { href: '/marketplace', label: t('marketplace'), icon: Store },
    {
      href: '/marketplace-boost',
      label: t('marketplaceBoost'),
      icon: TrendingUp,
    },
    { href: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Logo />
          <span className="sr-only">AgriAssist</span>
        </Link>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'transition-colors hover:text-foreground',
              getActivePath(link.href)
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {links.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href}>{link.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex w-full items-center gap-4 md:ml-auto md:flex-initial">
         <div className="md:hidden">
            <Logo />
         </div>
         <div className="ml-auto">
             <Link href="/settings">
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                </Button>
            </Link>
         </div>
      </div>
    </header>
  );
}
