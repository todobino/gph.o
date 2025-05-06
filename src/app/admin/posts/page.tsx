
import { PostsDataTable } from '@/components/admin/posts-data-table';
import { getPosts, type Post } from '@/services/posts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Define columns for the data table - simplified for now
const columns = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'date', header: 'Publish Date' },
  { accessorKey: 'tags', header: 'Tags' },
  // Author column omitted as it's not in the data source
];

export const dynamic = 'force-dynamic'; // Ensure fresh data on each load

export default async function AdminPostsPage() {
  const posts = await getPosts();

  // Format data slightly for the table if needed (e.g., tags)
  const formattedPosts = posts.map(post => ({
    ...post,
    // Ensure tags are displayable, e.g., join array
    tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
  }));


  return (
    <div className="space-y-8 p-4 md:p-8">
       <h1 className="text-3xl md:text-4xl font-bold">Manage Posts</h1>

        <Card>
            <CardHeader>
                <CardTitle>All Posts</CardTitle>
                <CardDescription>View, filter, and manage all blog posts.</CardDescription>
            </CardHeader>
            <CardContent>
                 {/* Pass the columns and data to the DataTable */}
                 {/* Note: The PostsDataTable component needs to be created */}
                 <PostsDataTable columns={columns} data={formattedPosts} />
            </CardContent>
        </Card>
    </div>
  );
}
