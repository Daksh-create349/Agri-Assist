import { Sidebar } from '@/components/sidebar';
import { VoiceAssistant } from '@/components/voice-assistant';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        {children}
      </div>
      <VoiceAssistant />
    </div>
  );
}
