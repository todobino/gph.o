
import type { Post } from '@/services/posts';
import Link from 'next/link';

interface RelatedPostsSectionProps {
  posts: Post[];
}

export function RelatedPostsSection({ posts }: RelatedPostsSectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-accent p-6 md:p-8 rounded-lg shadow-sm mt-12">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-accent-foreground font-heading">
        Related Posts
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {posts.map((post) => {
          const slug = post.slug;
          return (
            <li key={post.slug}>
              <Link
                href={`/posts/${slug}`}
                className="block group"
              >
                <h3 className="text-lg font-semibold text-accent-foreground group-hover:underline mb-0.5 line-clamp-2 font-heading">
                  {post.title}
                </h3>
                <p className="text-xs text-accent-foreground/80">
                  {new Date(post.date).toLocaleDateString()}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
