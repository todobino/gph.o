
import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '@/services/posts';
import { EmailSignupForm } from '@/components/email-signup-form';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlayCircle } from 'lucide-react';

// Mastodon SVG Icon Component
const MastodonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
        <path d="M23.193 7.879c0-5.206-3.413-6.732-3.413-6.732C18.654.556 16.63.25 14.195.25c-2.434 0-4.869.274-4.869.274C6.892.56 5.868 1.44 5.256 2.223c-.762.972-.857 2.53-.857 2.53s-.04 1.62.19 3.292c.23 1.67.545 3.39.545 3.39s-.144.119-.286.23c-1.393 1.076-2.92 2.02-2.92 3.864 0 2.272 2.374 2.895 2.374 2.895s1.82.722 3.638.933c1.82.21 3.92.315 6.09.315h.063c2.17-.002 4.27-.106 6.09-.315 1.82-.21 3.638-.933 3.638-.933s2.374-.623 2.374-2.895c0-1.844-1.527-2.788-2.92-3.864-.142-.112-.286-.23-.286-.23s.316-1.72.546-3.39c.23-1.672.19-3.29.19-3.29s.096-1.558-.857-2.53zM12.043 14.43h-2.18v-4.542c0-.51.415-.925.925-.925s.925.415.925.925v3.617h1.255V9.893c0-1.284-1.04-2.323-2.324-2.323s-2.323 1.04-2.323 2.324v3.47H6.51v-2.016c0-.51.415-.925.925-.925s.925.415.925.925v1.09h1.25V9.893c0-1.284-1.04-2.323-2.324-2.323S5.51 8.61 5.51 9.893v4.542h2.186v-2.016c0-.51.415-.925.925-.925s.925.415.925.925v2.016h1.497zm5.22-2.016c0-.51.415-.925.925-.925s.925.415.925.925v2.016h2.07v-2.016c0-1.284-1.04-2.323-2.324-2.323s-2.323 1.04-2.323 2.324v2.016h2.64v-2.016z" />
    </svg>
);


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
                    src="https://i.ytimg.com/vi/lHoOUylvfxQ/hqdefault.jpg" // YouTube thumbnail
                    alt="Featured video thumbnail for Mob Programming"
                    fill // Use fill to cover the container
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                   {/* Play Icon */}
                   <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="h-12 w-12 text-white/80 transition-transform duration-300 group-hover:scale-110 group-hover:text-white" />
                   </div>
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
               <div className="pt-4 text-center border-t border-dashed mt-6">
                <p className="text-sm text-muted-foreground mb-2">Follow on Mastodon</p>
                <Button asChild variant="outline">
                  <Link href="https://mastodon.social/@GeePawHill" target="_blank" rel="noopener noreferrer">
                    <MastodonIcon className="h-5 w-5 mr-2" />
                    Mastodon
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          {/* Separator removed */}
        </div>
      </div>
      {/* Full-width bottom row with light gray background and top border */}
      <div className="bg-secondary py-4 border-t">
        <div className="container mx-auto px-2">
          <div className="flex items-center justify-center gap-4">
            <p className="text-center text-sm leading-loose text-muted-foreground">
              &copy; {new Date().getFullYear()} GeePawHill.Org. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
