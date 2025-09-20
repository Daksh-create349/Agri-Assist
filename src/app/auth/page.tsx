import { AuthForm } from './auth-form';
import { Logo } from '@/components/logo';

export default function AuthenticationPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-6 lg:p-8">
      {/* Background Video */}
      <video
        src="https://cdn.pixabay.com/video/2024/06/22/217753_large.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover -z-10"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm -z-10" />

      {/* Form Content */}
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 rounded-lg border bg-card/80 p-8 shadow-lg sm:w-[380px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to AgriAssist
          </h1>
          <p className="text-sm text-muted-foreground">
            Your intelligent partner in modern farming.
          </p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
