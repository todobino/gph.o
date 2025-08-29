
import { getPosts, type Post } from '@/services/posts';
import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

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

export default async function AdminPostsPage() {
  const posts: Post[] = await getPosts();

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
          <PostsDataTable columns={columns} data={posts} />
        </CardContent>
      </Card>
    </div>
  );
}
