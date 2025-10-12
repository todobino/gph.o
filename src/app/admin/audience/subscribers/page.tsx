
'use client';

import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getSubscribers, type Subscriber } from '@/services/subscribers';
import { useEffect, useState } from 'react';
import { useIsAdmin } from '@/hooks/useUser';
import { Skeleton } from '@/components/ui/skeleton';

// Subscriber data and columns
const subscriberColumns = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'displayName',
    header: 'Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'listIds',
    header: 'Lists',
  },
];


export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (isAdmin) {
      getSubscribers().then(setSubscribers);
    }
  }, [isAdmin]);

   if (isAdmin === undefined) {
    return (
       <Card>
          <CardHeader>
              <Skeleton className="h-8 w-1/4" />
          </CardHeader>
          <CardContent>
              <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
              </div>
          </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>All Subscribers</CardTitle>
                    <Button asChild>
                      <Link href="/admin/audience/lists/new">
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
