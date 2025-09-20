import { AuthForm } from './auth-form';
import { Logo } from '@/components/logo';

export default function AuthenticationPage() {
  return (
    <main className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
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
      </div>
      <div className="relative hidden lg:block">
        <video
          src="https://cdn.pixabay.com/video/2021/08/04/83896-585600461_large.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-background/0" />
      </div>
    </main>
  );
}
