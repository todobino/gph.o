import { type Metadata, type ResolvingMetadata } from 'next';
import type { ReactNode } from 'react';
import { getPostBySlug, type Post, getPosts } from '@/services/posts';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { RelatedPostsSection } from '@/components/posts/related-posts-section';
import { BookOpen } from 'lucide-react'; // Import BookOpen for series icon

// Helper function to convert string to Title Case (copied from posts/page.tsx)
function toTitleCase(str: string): string {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata(
  { params, searchParams }: { params: { slug: string }; searchParams: Record<string, string | string[] | undefined> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  if (!slug) return {};
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.content.split('\n').slice(0, 2).join(' ').substring(0, 160) + '...',
  };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  if (!posts || posts.length === 0) return [];
  return posts.map((post) => ({ slug: post.slug }));
}

interface PostPageProps {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  if (!slug) notFound();

  const currentPost = await getPostBySlug(slug);
  if (!currentPost) notFound();

  const allPosts = await getPosts();
  const relatedPosts = allPosts
    .filter(post =>
      post.slug !== currentPost.slug &&
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, 4);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Posts', href: '/posts' },
    { label: currentPost.title }, // Current page, no href
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-heading">{currentPost.title}</h1>
          <p className="text-muted-foreground text-sm mb-2"> {/* Reduced mb from 4 to 2 */}
            Published on {new Date(currentPost.date).toLocaleDateString()}
          </p>
          {currentPost.series && (
            <p className="text-muted-foreground text-sm mb-4 flex items-center">
              <BookOpen className="h-4 w-4 mr-1.5 text-primary" />
              Part of the series: <Link href={`/posts?series=${encodeURIComponent(currentPost.series)}`} className="ml-1 text-primary hover:underline">{currentPost.series}</Link>
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {currentPost.tags.map((tag) => (
              <Link key={tag} href={`/posts?tag=${tag}`} scroll={false}>
                <Badge
                  variant={cn(
                    "cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md py-1.5 px-3 border border-border"
                  ) as any}
                >
                  {toTitleCase(tag)}
                </Badge>
              </Link>
            ))}
          </div>
        </header>

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (props) => <h1 className="text-3xl font-semibold mt-8 mb-4 font-heading" {...props} />,
            h2: (props) => <h2 className="text-2xl font-semibold mt-6 mb-3 font-heading" {...props} />,
            h3: (props) => <h3 className="text-xl font-semibold mt-4 mb-2 font-heading" {...props} />,
            p: (props) => <p className="my-4 leading-relaxed" {...props} />,
            a: (props) => <a className="text-primary hover:underline" {...props} />,
            ul: (props) => <ul className="list-disc list-inside my-4 pl-4 space-y-1" {...props} />,
            ol: (props) => <ol className="list-decimal list-inside my-4 pl-4 space-y-1" {...props} />,
            li: (props) => <li className="my-1" {...props} />,
            blockquote: (props) => (
              <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />
            ),
            code: ({
              inline,
              className,
              children,
              ...props
            }: {
              inline?: boolean;
              className?: string;
              children?: ReactNode;
            } & React.HTMLAttributes<HTMLElement>) => {
              const match = /language-(\w+)/.exec(className || '');
              if (!inline) {
                return (
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto my-4">
                    <code className={`language-${match?.[1] ?? ''}`} {...props}>
                      {children}
                    </code>
                  </pre>
                );
              }
              return (
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {currentPost.content}
        </ReactMarkdown>
      </article>
      
      {relatedPosts.length > 0 && (
        <RelatedPostsSection posts={relatedPosts} />
      )}
    </div>
  );
}
