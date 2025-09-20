'use client';
import Link from 'next/link';
import { Settings } from 'lucide-react';
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
import { Button } from '@/components/ui/button';


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
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
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden"/>
                <Logo className="md:hidden"/>
            </div>

            <div className="flex items-center">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/settings">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Settings</span>
                    </Link>
                </Button>
            </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
