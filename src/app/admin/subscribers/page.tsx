
import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

// Placeholder subscriber data and columns
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
    accessorKey: 'listIds',
    header: 'Lists',
  },
  {
    accessorKey: 'createdAt',
    header: 'Subscribed On',
  },
];

const placeholderSubscribers = [
    { id: '1', email: 'example1@geepawhill.org', status: 'Subscribed', listIds: ['newsletter'], createdAt: '2024-07-01' },
    { id: '2', email: 'example2@geepawhill.org', status: 'Pending', listIds: ['selfPacedCourse'], createdAt: '2024-07-02' },
];


export default function AdminSubscribersPage() {
  return (
    <div className="space-y-8">
        <h1 className="text-4xl font-bold font-heading">Manage Subscribers</h1>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>All Subscribers</CardTitle>
                    <Button asChild>
                      <Link href="/admin/subscribers/new-list">
                        <Plus className="mr-2 h-4 w-4" />
                        New List
                      </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                 <PostsDataTable 
                    columns={subscriberColumns} 
                    data={placeholderSubscribers} 
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
