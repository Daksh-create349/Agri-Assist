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
];

const NavLink = ({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isActive && 'bg-muted text-primary'
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
};


export function Sidebar() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-muted/40 md:flex">
        <div className="flex h-14 items-center border-b px-6">
          <Logo />
        </div>
        <nav className="flex flex-col justify-between flex-1 gap-4 p-4">
            <div className="grid gap-1">
                {links.map((link) => (
                    <NavLink key={link.href} href={link.href} icon={link.icon}>
                        {link.label}
                    </NavLink>
                ))}
            </div>
            <div>
                 <NavLink href="/settings" icon={Settings}>
                    Settings
                </NavLink>
            </div>
        </nav>
      </aside>
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
         <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                 <div className="flex h-14 items-center border-b px-6 -mx-6 mb-2">
                    <Logo />
                 </div>
                  {links.map((link) => (
                     <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
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
          <div className="md:hidden">
            <Logo/>
          </div>
       </header>
    </>
  );
}
