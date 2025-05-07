
import type { Post } from '@/services/posts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface RelatedPostsSectionProps {
  posts: Post[];
}

export function RelatedPostsSection({ posts }: RelatedPostsSectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-accent p-6 md:p-8 rounded-lg shadow-sm mt-12">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-accent-foreground">
        Related Posts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => {
          const slug = post.slug;
          return (
            <Link key={post.slug} href={`/posts/${slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
              <Card className="flex flex-col h-full transition-all duration-200 border border-border group-hover:border-primary group-hover:shadow-lg bg-card">
                <CardHeader>
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={`https://picsum.photos/seed/${slug}-related/400/200`}
                      alt={`Thumbnail for ${post.title}`}
                      width={400}
                      height={200}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="blog post abstract tech related"
                    />
                  </div>
                  <CardTitle className="mt-4 text-card-foreground">{post.title}</CardTitle>
                  <CardDescription>{new Date(post.date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">
                    {post.content.split('\n').slice(0, 3).join(' ')}...
                  </p>
                </CardContent>
                <CardFooter>
                  <span className={cn(buttonVariants({ variant: "link", className: "p-0 pointer-events-none text-primary" }))}>
                    Read More
                  </span>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
