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
  Rss,
  User,
} from 'lucide-react';

import { Logo } from '@/components/logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
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
  { href: '/my-poll', label: 'My Poll', icon: Rss },
  { href: '/profile', label: 'My Profile', icon: User },
];

export function Sidebar() {
    const pathname = usePathname();
    return (
        <>
            <aside className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                            <Logo />
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", 
                                pathname === link.href && "bg-muted text-primary"
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-auto p-4">
                        <Link
                            href="/settings"
                            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            pathname === '/settings' && "bg-muted text-primary"
                            )}
                            >
                            <Settings className="h-4 w-4" />
                            Settings
                        </Link>
                    </div>
                </div>
            </aside>
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col">
                    <nav className="grid gap-2 text-lg font-medium">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-lg font-semibold mb-4"
                        >
                            <Logo />
                            <span className="sr-only">AgriAssist</span>
                        </Link>
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                                pathname === link.href && "bg-muted text-foreground"
                                )}
                            >
                                <link.icon className="h-5 w-5" />
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                     <div className="mt-auto">
                        <Link
                            href="/settings"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                            >
                            <Settings className="h-5 w-5" />
                            Settings
                        </Link>
                    </div>
                    </SheetContent>
                </Sheet>
                 <div className="w-full flex-1">
                    {/* Optionally add a search bar or other header elements here for mobile */}
                </div>
            </header>
       </>
    );
}
