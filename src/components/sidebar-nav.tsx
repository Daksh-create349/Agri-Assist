
'use client';

import {
  FlaskConical,
  Leaf,
  MapPin,
  Scan,
  Store,
  TestTube,
  TrendingUp,
  LayoutDashboard,
  Settings
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/soil-analysis', label: 'Soil Analysis', icon: TestTube },
  { href: '/crop-recommendation', label: 'Crop Recommendation', icon: Leaf },
  { href: '/disease-identification', label: 'Disease ID', icon: Scan },
  { href: '/fertilizer-recommendation', label: 'Fertilizer Recs', icon: FlaskConical },
  { href: '/crop-guidance', label: 'Crop Guidance', icon: MapPin },
  { href: '/marketplace', label: 'Marketplace', icon: Store },
  { href: '/marketplace-boost', label: 'Marketplace Boost', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
