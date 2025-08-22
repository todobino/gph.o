import { getPosts } from '@/services/posts';
import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default async function AdminPostsPage() {
  const posts = await getPosts();

  // Define the columns for the data table
  const columns = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'tags', header: 'Tags' },
    { accessorKey: 'author', header: 'Author' },
    { accessorKey: 'status', header: 'Status' }, // Assuming a status field might exist
  ];

  // Filter out columns that don't exist on the post object
  // to prevent errors in the data table.
  const validColumns = columns.filter(col => 
    posts.length === 0 || Object.keys(posts[0]).includes(col.accessorKey) || col.accessorKey === 'status' // Allow status for now
  );


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold font-heading">Manage Posts</h1>
          <p className="text-muted-foreground">
            Here you can create, edit, and manage all the posts on the site.
          </p>
        </div>
        <Button asChild disabled>
          <Link href="/admin/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <PostsDataTable columns={validColumns} data={posts} />
    </div>
  );
}
