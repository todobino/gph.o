
'use client';
import { redirect, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AdminRedirect() {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');
    if (!tab) {
        redirect('/account?tab=admin');
    } else {
        redirect('/account?' + searchParams.toString());
    }
    return null;
}

export default function AdminPage() {
  // The root /admin page should now redirect to the account page,
  // which will handle showing the admin tab for authorized users.
  return (
    <Suspense>
        <AdminRedirect />
    </Suspense>
  )
}
