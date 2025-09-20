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
import { useTranslations } from 'next-intl';

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';


export function SidebarNav() {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/soil-analysis', label: t('soilAnalysis'), icon: TestTube },
    { href: '/crop-recommendation', label: t('cropRecommendation'), icon: Leaf },
    { href: '/disease-identification', label: t('diseaseId'), icon: Scan },
    { href: '/fertilizer-recommendation', label: t('fertilizerRecs'), icon: FlaskConical },
    { href: '/crop-guidance', label: t('cropGuidance'), icon: MapPin },
    { href: '/marketplace', label: t('marketplace'), icon: Store },
    { href: '/marketplace-boost', label: t('marketplaceBoost'), icon: TrendingUp },
    { href: '/settings', label: t('settings'), icon: Settings },
  ]


  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.endsWith(link.href)}
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
