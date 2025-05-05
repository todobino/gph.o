
import { type Metadata, type ResolvingMetadata, type PageProps} from 'next';
import { getPosts, type Post } from '@/services/github'; // Renamed function and type
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown'; // Requires `npm install react-markdown`
import remarkGfm from 'remark-gfm'; // Requires `npm install remark-gfm` for GitHub Flavored Markdown

export const revalidate = 60; // Revalidate every 60 seconds

// Generate static paths for posts
export async function generateStaticParams() {
  const posts = await getPosts(); // Use renamed function
  return posts.map((post) => ({
    slug: post.title.toLowerCase().replace(/\s+/g, '-'),
  }));
}

// Find post by slug
async function getPostBySlug(slug: string): Promise<Post | undefined> { // Use renamed type
  const posts = await getPosts(); // Use renamed function
  return posts.find(post => post.title.toLowerCase().replace(/\s+/g, '-') === slug);
}

 
interface PostPageProps extends PageProps {
}

export default async function PostPage({ params }: PostPageProps) { 
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
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
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
       </header>
       {/* Render Markdown content */}
       {/* Add styling for markdown elements in globals.css if needed */}
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Customize rendering of specific elements if needed
              // Example: Add styling to headings
              h1: ({node, ...props}) => <h1 className="text-3xl font-semibold mt-8 mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
              p: ({node, ...props}) => <p className="my-4 leading-relaxed" {...props} />,
              a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside my-4 pl-4 space-y-1" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside my-4 pl-4 space-y-1" {...props} />,
              li: ({node, ...props}) => <li className="my-1" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />,
              code: ({node, inline, className, children, ...props}) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline ? (
                   // Basic code block styling, consider using a syntax highlighter library
                   <pre className="bg-muted p-4 rounded-md overflow-x-auto my-4">
                    <code className={`language-${match?.[1] ?? ''}`} {...props}>
                       {children}
                    </code>
                   </pre>
                 ) : (
                   <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm" {...props}>
                     {children}
                   </code>
                )
              },
              // Add more custom components as needed (e.g., img, table)
            }}
        >
            {post.content}
        </ReactMarkdown>
    </article>
  );
}

// Add this to your package.json dependencies:
// "react-markdown": "^9.0.0", // Or latest version
// "remark-gfm": "^4.0.0" // Or latest version
// Then run `npm install`
