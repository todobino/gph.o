import Link from 'next/link';
import { getBlogPosts, type BlogPost } from '@/services/github';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogSidebar } from '@/components/blog/blog-sidebar';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPage() {
  const posts = await getBlogPosts();

  // Extract all unique tags and archives
  const tags = Array.from(new Set(posts.flatMap(post => post.tags)));
  const archives = Array.from(new Set(posts.map(post => new Date(post.date).toLocaleString('default', { month: 'long', year: 'numeric' })))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());


  return (
    <div className="flex flex-col md:flex-row gap-8">
       <aside className="w-full md:w-1/4 lg:w-1/5">
         <BlogSidebar tags={tags} archives={archives} />
       </aside>
       <main className="w-full md:w-3/4 lg:w-4/5">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="grid grid-cols-1 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.title}>
                <CardHeader>
                  <CardTitle>
                    <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary transition-colors">
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
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                 <CardFooter>
                   <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-primary hover:underline">
                     Read More
                   </Link>
                 </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No blog posts found.</p>
          )}
        </div>
       </main>
    </div>
  );
}
