import { redirect } from 'next/navigation';

export default function AdminPage() {
  // The root /admin page should now redirect to the account page,
  // which will handle showing the admin tab for authorized users.
  redirect('/account?tab=admin');
}
