
import Link from 'next/link';
import { getPosts, type Post } from '@/services/github'; // Renamed function and type
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PostsSidebar } from '@/components/posts/posts-sidebar'; // Renamed component
import { cn } from '@/lib/utils'; // Import cn

export const revalidate = 60; // Revalidate every 60 seconds

// Helper function to convert string to Title Case (copied from sidebar)
function toTitleCase(str: string): string {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}


export default async function PostsPage({ searchParams }: { searchParams?: { tag?: string; archive?: string } }) {
  let posts = await getPosts(); // Use renamed function

  // Filter by tag
  if (searchParams?.tag) {
    posts = posts.filter(post => post.tags.includes(searchParams.tag!));
  }

  // Filter by archive date
  if (searchParams?.archive) {
    posts = posts.filter(post => {
      const postDate = new Date(post.date);
      const archiveDateStr = searchParams.archive!;
      // Basic check assuming "Month Year" format
      const postArchiveStr = postDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      return postArchiveStr === archiveDateStr;
    });
  }


  // Extract all unique tags and archives from the *original* unfiltered list for the sidebar
  const allPostsForSidebar = await getPosts();
  const tags = Array.from(new Set(allPostsForSidebar.flatMap(post => post.tags)));
  const archives = Array.from(new Set(allPostsForSidebar.map(post => new Date(post.date).toLocaleString('default', { month: 'long', year: 'numeric' })))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());


  return (
    // Apply negative horizontal margins to counteract layout padding
    <div className="flex flex-col md:flex-row gap-8 -mx-4 md:mx-0">
       {/* Updated sidebar width: md:w-1/3 lg:w-1/4 */}
       <aside className="w-full md:w-1/3 lg:w-1/4 px-4 md:px-0"> {/* Add padding back for sidebar on mobile */}
         <PostsSidebar tags={tags} archives={archives} /> {/* Use renamed component */}
       </aside>
       {/* Updated main content width: md:w-2/3 lg:w-3/4 */}
       <main className="w-full md:w-2/3 lg:w-3/4 px-4 md:px-0"> {/* Add padding back for main content on mobile */}
        <h1 className="text-4xl font-bold mb-8">Posts</h1> {/* Renamed heading */}
        <div className="grid grid-cols-1 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => {
              const slug = post.title.toLowerCase().replace(/\s+/g, '-'); // Generate slug consistently
              return (
                <Card key={post.title}>
                  <CardHeader>
                    <CardTitle>
                      <Link href={`/posts/${slug}`} className="hover:text-primary transition-colors"> {/* Updated link */}
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      Published on {new Date(post.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Displaying first few lines as excerpt */}
                    <p className="text-muted-foreground line-clamp-3">
                       {post.content.split('\n').slice(0,3).join(' ')}...
                    </p>
                     <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="border border-border py-1.5 px-3 rounded-md"> {/* Apply title casing and border */}
                           {toTitleCase(tag)}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                   <CardFooter>
                     <Link href={`/posts/${slug}`} className="text-sm text-primary hover:underline"> {/* Updated link */}
                       Read More
                     </Link>
                   </CardFooter>
                </Card>
              );
            })
          ) : (
            <p className="text-muted-foreground">No posts found matching your filters.</p>
          )}
        </div>
       </main>
    </div>
  );
}

