
'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AudiencePage() {
    useEffect(() => {
        redirect('/admin/audience/subscribers');
    }, []);

    return null;
}
