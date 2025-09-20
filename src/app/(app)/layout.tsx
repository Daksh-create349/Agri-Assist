'use client';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {onAuthStateChanged, User} from 'firebase/auth';

import {auth} from '@/lib/firebase/client-app';
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


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Changed to false to bypass auth check

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

  if (loading) {
     return (
       <div className="flex h-screen w-full items-center justify-center">
         <div className="w-full max-w-md space-y-4 p-4">
          <div className="flex items-center space-x-2 justify-center">
            <Logo />
          </div>
          <p className="text-center text-muted-foreground">Checking authentication...</p>
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
          <SidebarTrigger/>
          <Logo/>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
