import { ProfileForm } from './profile-form';

export default function ProfilePage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Update your personal information and manage your account.
        </p>
      </div>
      <ProfileForm />
    </main>
  );
}
