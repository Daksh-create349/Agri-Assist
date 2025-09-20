import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

const AgriAssistIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11 20A7 7 0 0 1 4 13H2a9 9 0 0 0 18 0h-2a7 7 0 0 1-7 7Z" />
    <path d="M12 12V2" />
    <path d="m5 12 1.8-1.8" />
    <path d="m17.2 10.2 1.8 1.8" />
  </svg>
);

export function Logo({ className, isCollapsed }: { className?: string, isCollapsed?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <AgriAssistIcon className="h-6 w-6 text-primary" />
      <span className={cn(
          "text-lg font-bold font-headline text-sidebar-foreground",
          isCollapsed && "hidden"
          )}>
        AgriAssist
      </span>
    </div>
  );
}
