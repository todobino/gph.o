
'use client';

import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getLists, type List } from '@/services/subscribers';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Placeholder list data and columns
const listColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'subscribed',
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

  useEffect(() => {
    getLists().then(setLists);
  }, []);


  return (
    <div>
        <h1 className="text-4xl font-bold font-heading mb-8">Manage Lists</h1>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>All Lists</CardTitle>
                    <Button asChild>
                      <Link href="/admin/lists/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New
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
