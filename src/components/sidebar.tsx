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
  Home,
  PanelLeft,
} from 'lucide-react';

import { Logo } from '@/components/logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/soil-analysis', label: 'Soil Analysis', icon: TestTube },
  {
    href: '/crop-recommendation',
    label: 'Crop Recommendation',
    icon: Leaf,
  },
  { href: '/disease-identification', label: 'Disease Identification', icon: Scan },
  {
    href: '/fertilizer-recommendation',
    label: 'Fertilizer Recommendation',
    icon: FlaskConical,
  },
  { href: '/crop-guidance', label: 'Location Guidance', icon: MapPin },
  { href: '/marketplace', label: 'Marketplace', icon: Store },
  {
    href: '/marketplace-boost',
    label: 'Marketplace Boost',
    icon: TrendingUp,
  },
];

export function Sidebar() {
    const pathname = usePathname();
    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Link
                        href="/dashboard"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                        >
                        <Logo />
                        <span className="sr-only">AgriAssist</span>
                    </Link>
                    <TooltipProvider>
                        {links.map((link) => (
                        <Tooltip key={link.href}>
                            <TooltipTrigger asChild>
                            <Link
                                href={link.href}
                                className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8", 
                                pathname === link.href && "bg-accent text-accent-foreground"
                                )}
                            >
                                <link.icon className="h-5 w-5" />
                                <span className="sr-only">{link.label}</span>
                            </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">{link.label}</TooltipContent>
                        </Tooltip>
                        ))}
                    </TooltipProvider>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                            href="/settings"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
            </aside>
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                        href="/dashboard"
                        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                        >
                        <Logo />
                        <span className="sr-only">AgriAssist</span>
                        </Link>
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn("flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                                pathname === link.href && "text-foreground"
                                )}
                            >
                                <link.icon className="h-5 w-5" />
                                {link.label}
                            </Link>
                        ))}
                         <Link
                            href="/settings"
                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                            <Settings className="h-5 w-5" />
                            Settings
                        </Link>
                    </nav>
                    </SheetContent>
                </Sheet>
            </header>
       </>
    );
}