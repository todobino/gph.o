

import { type Metadata, type ResolvingMetadata } from 'next';
import React, { type ReactNode } from 'react';
import { getPostBySlug, type Post, getPosts, getAllSeries } from '@/services/posts';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { RelatedPostsSection } from '@/components/posts/related-posts-section';
import { BookOpen, Calendar, Tags, User } from 'lucide-react';
import { PostsSidebar } from '@/components/posts/posts-sidebar';

// Helper function to convert string to Title Case (copied from posts/page.tsx)
function toTitleCase(str: string): string {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata(
  { params, searchParams }: { params: { slug: string }; searchParams: Record<string, string[] | undefined> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
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
  const slug = params.slug;
  if (!slug) notFound();

  const currentPost = await getPostBySlug(slug);
  if (!currentPost) notFound();

  // Fetch data for sidebar and related posts
  const allPosts = await getPosts();
  const tags = Array.from(new Set(allPosts.flatMap(post => post.tags)));
  const archives = Array.from(new Set(allPosts.map(post => new Date(post.date).toLocaleString('default', { month: 'long', year: 'numeric' })))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const series = await getAllSeries();

  const relatedPosts = allPosts
    .filter(post =>
      post.slug !== currentPost.slug &&
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, 4);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: currentPost.title }, // Current page, no href
  ];

  return (
    <div>
      {/* Full-width header section */}
      <section className="bg-secondary border rounded-lg px-2 md:px-8 py-8 mb-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />
          <header className="mt-4">
            <h1 className="text-4xl font-bold mb-2 font-heading text-primary">{currentPost.title}</h1>
            {currentPost.series && (
              <p className="text-muted-foreground text-sm mb-4 flex items-center">
                <BookOpen className="h-4 w-4 mr-1.5 text-primary" />
                Part of the series: <Link href={`/blog?series=${encodeURIComponent(currentPost.series)}`} className="ml-1 text-primary hover:underline">{currentPost.series}</Link>
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{new Date(currentPost.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{currentPost.author}</span>
              </div>
              {currentPost.tags.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Tags className="h-4 w-4" />
                  <div className="flex flex-wrap gap-1">
                    {currentPost.tags.map((tag, index) => (
                      <React.Fragment key={tag}>
                        <Link href={`/blog?tag=${tag}`} className="hover:text-primary hover:underline">
                          {toTitleCase(tag)}
                        </Link>
                        {index < currentPost.tags.length - 1 && <span>,</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </header>
        </div>
      </section>

      {/* Main content and sidebar */}
      <div className="flex flex-col md:flex-row gap-8">
        <main className="w-full md:w-2/3 lg:w-3/4">
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: (props) => <h1 className="text-3xl font-semibold mt-8 mb-4 font-heading first:mt-0" {...props} />,
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
        </main>
        <aside className="w-full md:w-1/3 lg:w-1/4">
          <div className="sticky top-24">
            <PostsSidebar tags={tags} archives={archives} series={series} />
          </div>
        </aside>
      </div>
    </div>
  );
}
