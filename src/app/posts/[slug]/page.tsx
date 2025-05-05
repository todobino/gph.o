
import { type Metadata, type ResolvingMetadata } from 'next';
import { getPostBySlug, type Post, getPosts } from '@/services/posts'; // Updated import path
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateMetadata(
  { params, searchParams }: { params: { slug: string }; searchParams: Record<string, string | string[] | undefined> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;

  if (!slug) {
    return {};
  }

  // Fetch the post data using the corrected function
  const post = await getPostBySlug(slug);

  if (!post) {
    return {}; // Or return a default metadata for not found
  }
  return {
    title: post.title,
    // Generate a concise description from the content
    description: post.content.split('\n').slice(0, 2).join(' ').substring(0, 160) + '...',
    // Add other metadata like og:image etc.

  };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  if (!posts || posts.length === 0) {
    return [];
  }
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface PostPageProps {
  params: { slug: string };
  searchParams:  Record<string, string | string[] | undefined>
}
export default async function PostPage({ params, searchParams }: PostPageProps) {
  const { slug } = params;

  if (!slug) {

    notFound(); // Should not happen based on route structure, but good practice
  }

  const post = await getPostBySlug(slug); // Fetch by slug

  if (!post) {
    notFound(); // Use Next.js notFound function
  }

  return (
    <article className="prose prose-lg dark:prose-invert max-w-none mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <p className="text-muted-foreground text-sm mb-4">
          Published on {new Date(post.date).toLocaleDateString()}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </header>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
           h1: ({ node, ...props }) => (

            <h1 className="text-3xl font-semibold mt-8 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-4 leading-relaxed" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-primary hover:underline" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside my-4 pl-4 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside my-4 pl-4 space-y-1" {...props} />
          ),
          li: ({ node, ...props }) => <li className="my-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: { node: any; inline?: boolean; className?: string; children: React.ReactNode; } & { [key: string]: any }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline ? (<pre className="bg-muted p-4 rounded-md overflow-x-auto my-4">
            <code className={`language-${match?.[1] ?? ""}`} {...props}>{children}</code>
          </pre>
        ) : (
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
