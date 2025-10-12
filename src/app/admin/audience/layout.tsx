
'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, List, ClipboardType } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const audienceNavItems = [
  { href: '/admin/audience/subscribers', label: 'Subscribers', icon: <Users /> },
  { href: '/admin/audience/lists', label: 'Lists', icon: <List /> },
  { href: '/admin/audience/forms', label: 'Forms', icon: <ClipboardType /> },
];

export default function AudienceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-12 items-start">
      <aside className="w-1/4 sticky top-24">
        <h1 className="text-4xl font-bold font-heading mb-8">Audience</h1>
        <nav className="flex flex-col gap-1">
          {audienceNavItems.map(item => (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className="justify-start"
            >
              <Link href={item.href}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </aside>
      <div className="w-3/4">
        {children}
      </div>
    </div>
  );
}
