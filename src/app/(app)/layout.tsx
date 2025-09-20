'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { VoiceAssistant } from '@/components/voice-assistant';
import { cn } from '@/lib/utils';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div
      className={cn(
        'grid min-h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out',
        isSidebarCollapsed
          ? 'md:grid-cols-[72px_1fr]'
          : 'md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'
      )}
    >
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col">
        {children}
      </div>
      <VoiceAssistant />
    </div>
  );
}
