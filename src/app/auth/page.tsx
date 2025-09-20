import { AuthForm } from './auth-form';
import { Logo } from '@/components/logo';

export default function AuthenticationPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
