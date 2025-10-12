
'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminRedirectPage() {
    useEffect(() => {
        redirect('/admin/overview');
    }, []);

    return null;
}
