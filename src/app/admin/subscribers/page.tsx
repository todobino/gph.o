
import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getSubscribers, type Subscriber } from '@/services/subscribers';

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


export default async function AdminSubscribersPage() {
  const subscribers: Subscriber[] = await getSubscribers();

  return (
    <div className="space-y-8">
        <h1 className="text-4xl font-bold font-heading">Manage Subscribers</h1>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>All Subscribers</CardTitle>
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
