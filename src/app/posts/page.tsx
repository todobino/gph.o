
import Link from 'next/link';
import { getPosts, type Post, getAllSeries } from '@/services/posts'; // Updated import path, added getAllSeries
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PostsSidebar } from '@/components/posts/posts-sidebar';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { PostsSidebarSkeleton } from '@/components/posts/posts-sidebar-skeleton';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export const revalidate = 60; // Revalidate every 60 seconds

function toTitleCase(str: string): string {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

interface PostsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const tagsFilter = searchParams?.tags as string | undefined;
  const archive = searchParams?.archive as string | undefined;
  const seriesFilter = searchParams?.series as string | undefined;
  let posts = await getPosts();

  const selectedTags = tagsFilter ? tagsFilter.split(',') : [];
  const isAnyFilterActive = selectedTags.length > 0 || !!archive || !!seriesFilter;

  if (selectedTags.length > 0) {
    posts = posts.filter(post => selectedTags.every(tag => post.tags.includes(tag)));
  }

  if (archive) {
    posts = posts.filter(post => {
      const postDate = new Date(post.date);
      const postArchiveStr = postDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      return postArchiveStr === archive;
    });
  }

  if (seriesFilter) {
    posts = posts.filter(post => post.series === seriesFilter);
  }

  const allPostsForSidebar = await getPosts();
  const allTags = Array.from(new Set(allPostsForSidebar.flatMap(post => post.tags)));
  const archives = Array.from(new Set(allPostsForSidebar.map(post => new Date(post.date).toLocaleString('default', { month: 'long', year: 'numeric' })))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const series = await getAllSeries();

  const getPageTitle = () => {
    if (selectedTags.length > 0) {
      return `Posts tagged: ${selectedTags.map(toTitleCase).join(' + ')}`;
    }
    if (archive) {
      return `Posts from: ${archive}`;
    }
    if (seriesFilter) {
      return `Posts in series: "${seriesFilter}"`;
    }
    return 'Posts';
  };


  return (
    <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
        <main className="w-full md:w-2/3 lg:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold font-heading">
                {getPageTitle()}
              </h1>
              {isAnyFilterActive && (
                <Button variant="outline" asChild>
                  <Link href="/posts">
                    <XCircle className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Link>
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6">
            {posts.length > 0 ? (
                posts.map((post) => {
                const slug = post.slug;
                return (
                    <Card key={post.slug}>
                    <CardHeader>
                        <CardTitle>
                        <Link href={`/posts/${slug}`} className="hover:text-primary transition-colors">
                            {post.title}
                        </Link>
                        </CardTitle>
                        <CardDescription>
                        Published on {new Date(post.date).toLocaleDateString()}
                        {post.series && (
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
                          <Link key={tag} href={`/posts?tags=${tag}`}>
                            <Badge variant="secondary" className="border border-border py-1.5 px-3 rounded-md hover:bg-primary/20 cursor-pointer">
                            {toTitleCase(tag)}
                            </Badge>
                          </Link>
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
        <aside className="w-full md:w-1/3 lg:w-1/4">
            <Suspense fallback={<PostsSidebarSkeleton />}>
            <PostsSidebar tags={allTags} archives={archives} series={series} />
            </Suspense>
        </aside>
        </div>
    </div>
  );
}
