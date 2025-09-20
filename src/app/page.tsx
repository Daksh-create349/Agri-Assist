// This is the root page of the application.
// It redirects the user to the default locale.
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/en');
}
