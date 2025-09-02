
'use client';

import { getPosts, type Post } from '@/services/posts';
import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useIsAdmin } from '@/hooks/useUser';
import { Skeleton } from '@/components/ui/skeleton';

// Define columns for the data table
const columns = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
  },
];

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (isAdmin) {
        getPosts().then(setPosts);
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
      <h1 className="text-4xl font-bold font-heading mb-8">Manage Posts</h1>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Posts</CardTitle>
            <Button asChild>
              <Link href="/admin/posts/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PostsDataTable columns={columns} data={posts} searchColumnId="title" />
        </CardContent>
      </Card>
    </div>
  );
}
