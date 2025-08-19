
import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '@/services/posts';
import { EmailSignupForm } from '@/components/email-signup-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export async function Footer() {
  // Fetch the 5 most recent posts
  const recentPosts = await getPosts().then(posts => posts.slice(0, 5));

  return (
    <footer className="border-t">
      <div className="container mx-auto px-2">
        {/* Constrained width section for 3-column grid */}
        <div className="pt-12 pb-8 space-y-8">
          {/* New 3-column section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Featured Video */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-heading">Featured Video</h3>
              <Link href="https://www.youtube.com/watch?v=lHoOUylvfxQ" target="_blank" rel="noopener noreferrer" className="block group">
                <div className="relative aspect-video overflow-hidden rounded-lg shadow-md">
                  <Image
                    src="https://picsum.photos/seed/footer-video/400/225" // Placeholder image
                    alt="Featured video thumbnail"
                    fill // Use fill to cover the container
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="video thumbnail abstract"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="text-primary-foreground text-sm font-medium line-clamp-2">
                        Watch: Mob Programming - A Whole Team Approach
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Column 2: Recent Posts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-heading">Recent Posts</h3>
              <ul className="space-y-2">
                {recentPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/posts/${post.slug}`} className="text-sm text-muted-foreground hover:text-primary hover:underline">
                      {post.title}
                    </Link>
                  </li>
                ))}
                {recentPosts.length > 4 && (
                  <li>
                      <Link href="/posts" className={cn(buttonVariants({ variant: "link", size: "sm", className: "p-0 h-auto" }))}>
                          View all posts...
                      </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Column 3: Stay Updated */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-heading">Stay Updated</h3>
              <EmailSignupForm />
            </div>
          </div>
          {/* Separator removed */}
        </div>
      </div>
      {/* Full-width bottom row with light gray background and top border */}
      <div className="bg-secondary py-4 border-t">
        <div className="container mx-auto px-2">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} GeePawHill.Org. All rights reserved.
            </p>
            <Link href="/login" className="text-sm text-primary hover:underline">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
