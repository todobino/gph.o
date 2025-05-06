import { type Metadata, type ResolvingMetadata } from 'next';
import type { ReactNode } from 'react';
import { getPostBySlug, type Post, getPosts } from '@/services/posts';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="prose prose-lg dark:prose-invert max-w-none mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <p className="text-muted-foreground text-sm mb-4">
          Published on {new Date(post.date).toLocaleDateString()}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="border border-border py-1.5 px-3 rounded-md"> {/* Added border and Title Case */}
              {toTitleCase(tag)}
            </Badge>
          ))}
        </div>
      </header>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-3xl font-semibold mt-8 mb-4" {...props} />,
          h2: (props) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
          h3: (props) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
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
        {post.content}
      </ReactMarkdown>
    </article>
  );
}
