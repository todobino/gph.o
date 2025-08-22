import { redirect } from 'next/navigation';

export default function AdminPage() {
  // The root /admin page should redirect to the posts manager
  // as it's the primary admin function for now.
  redirect('/admin/posts');
}
