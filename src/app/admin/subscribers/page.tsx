
'use client';

import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getSubscribers, type Subscriber } from '@/services/subscribers';
import { useEffect, useState } from 'react';

// Subscriber data and columns
const subscriberColumns = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'createdAt',
    header: 'Subscribed On',
    cell: ({ row }: { row: any }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleDateString();
    }
  },
];


export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    getSubscribers().then(setSubscribers);
  }, []);

  return (
    <div className="space-y-8">
        <h1 className="text-4xl font-bold font-heading">Manage Subscribers</h1>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>All Subscribers</CardTitle>
                    <Button asChild>
                      <Link href="/admin/lists/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New List
                      </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                 <PostsDataTable 
                    columns={subscriberColumns} 
                    data={subscribers} 
                    searchColumnId="email"
                    filterColumnId="status"
                    filterColumnName="Status"
                    searchPlaceholder='Search for subscriber...'
                />
            </CardContent>
        </Card>
    </div>
  );
}
