
import { getPosts, type Post } from '@/services/posts';
import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define columns for the data table
const columns = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'author',
    header: 'Author',
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
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <PostsDataTable columns={columns} data={posts} />
        </CardContent>
      </Card>
    </div>
  );
}
