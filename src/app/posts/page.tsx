

import Link from 'next/link';
import { getPosts, type Post, getAllSeries } from '@/services/posts'; // Updated import path, added getAllSeries
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PostsSidebar } from '@/components/posts/posts-sidebar';
import { cn } from '@/lib/utils';

export const revalidate = 60; // Revalidate every 60 seconds

function toTitleCase(str: string): string {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

interface PostsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const tag = searchParams?.tag as string | undefined;
  const archive = searchParams?.archive as string | undefined;
  const seriesFilter = searchParams?.series as string | undefined; // New series filter
  let posts = await getPosts();

  if (tag) {
    posts = posts.filter(post => post.tags.includes(tag));
  }

  if (archive) {
    posts = posts.filter(post => {
      const postDate = new Date(post.date);
      const postArchiveStr = postDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      return postArchiveStr === archive;
    });
  }

  if (seriesFilter) { // Filter by series
    posts = posts.filter(post => post.series === seriesFilter);
  }

  const allPostsForSidebar = await getPosts();
  const tags = Array.from(new Set(allPostsForSidebar.flatMap(post => post.tags)));
  const archives = Array.from(new Set(allPostsForSidebar.map(post => new Date(post.date).toLocaleString('default', { month: 'long', year: 'numeric' })))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const series = await getAllSeries(); // Get all unique series names

  return (
    <div className="flex flex-col md:flex-row gap-8 -mx-4 md:mx-0">
       <aside className="w-full md:w-1/3 lg:w-1/4 px-4 md:px-0">
         <PostsSidebar tags={tags} archives={archives} series={series} /> {/* Pass series to sidebar */}
       </aside>
       <main className="w-full md:w-2/3 lg:w-3/4 px-4 md:px-0">
        <h1 className="text-4xl font-bold mb-8 font-heading">
          {tag ? `Posts tagged: ${toTitleCase(tag)}` : 
           archive ? `Posts from: ${archive}` :
           seriesFilter ? `Posts in series: "${seriesFilter}"` : // Display series filter in title
           'Posts'}
        </h1>
        <div className="grid grid-cols-1 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => {
              const slug = post.slug;
              return (
                <Card key={post.slug}> {/* Use slug for key */}
                  <CardHeader>
                    <CardTitle>
                      <Link href={`/posts/${slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      Published on {new Date(post.date).toLocaleDateString()}
                       {post.series && ( // Display series if it exists
                         <span className="text-xs text-muted-foreground">
                           {' '}· Part of <Link href={`/posts?series=${encodeURIComponent(post.series)}`} className="hover:underline">{post.series}</Link>
                         </span>
                       )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                       {post.content.split('\n').slice(0,3).join(' ')}...
                    </p>
                     <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="border border-border py-1.5 px-3 rounded-md">
                           {toTitleCase(tag)}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                   <CardFooter>
                     <Link href={`/posts/${slug}`} className="text-sm text-primary hover:underline">
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
