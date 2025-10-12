
'use client';

import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getLists, type List } from '@/services/subscribers';
import { useEffect, useState } from 'react';
import { useIsAdmin } from '@/hooks/useUser';
import { Skeleton } from '@/components/ui/skeleton';

// Placeholder list data and columns
const listColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'subscriberCount',
    header: 'Subscribed',
    cell: ({ row }: { row: any }) => <div className="text-right pr-4">{row.original.subscriberCount}</div>,
  },
  {
    accessorKey: 'unconfirmed',
    header: 'Unconfirmed',
     cell: () => <div className="text-right pr-4">0</div>,
  },
  {
    accessorKey: 'unsubscribed',
    header: 'Unsubscribed',
    cell: () => <div className="text-right pr-4">0</div>,
  },
  {
      accessorKey: 'inactive',
      header: 'Inactive',
      cell: () => <div className="text-right pr-4">0</div>,
  },
  {
      accessorKey: 'bounced',
      header: 'Bounced',
      cell: () => <div className="text-right pr-4">0</div>,
  },
];

export default function AdminListsPage() {
  const [lists, setLists] = useState<List[]>([]);
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (isAdmin) {
      getLists().then(setLists);
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
    <div>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>All Lists</CardTitle>
                    <Button asChild>
                      <Link href="/admin/audience/lists/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add List
                      </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <PostsDataTable columns={listColumns} data={lists} searchColumnId="name" />
            </CardContent>
        </Card>
    </div>
  );
}
