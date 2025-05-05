
import type { Post } from '@/services/github'; // Renamed type definition
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { EmailSignupForm } from '@/components/email-signup-form';
import { getPosts } from '@/services/github'; // Renamed function

// Function to get videos (now filters from all posts)
async function getLatestVideos(): Promise<Post[]> { // Use renamed Post type
  const allPosts = await getPosts(); // Use renamed function
  // Filter posts by a 'video' tag
  return allPosts.filter(post => post.tags.includes('video')).slice(0, 3);
}


export default async function Home() {
  const latestVideos = await getLatestVideos();

  return (
    <div className="space-y-12">
      <section className="text-center py-16 bg-secondary rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to GeePawHill.Org</h1>
        <p className="text-xl text-muted-foreground mb-8">Thoughts on software development, agile practices, and more.</p>
        <Button asChild size="lg"><Link href="/posts">Read the Posts</Link></Button>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6">Latest Videos</h2>
        {latestVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestVideos.map((video) => {
               const slug = video.title.toLowerCase().replace(/\s+/g, '-'); // Generate slug
               return (
                <Card key={video.title} className="flex flex-col">
                    <CardHeader>
                    {/* Placeholder image */}
                    <Image
                        src={`https://picsum.photos/seed/${slug}/400/200`} // Use slug for placeholder seed
                        alt={`Thumbnail for ${video.title}`}
                        width={400}
                        height={200}
                        className="rounded-t-lg object-cover"
                        data-ai-hint="video thumbnail abstract tech"
                    />
                    <CardTitle className="mt-4">{video.title}</CardTitle>
                    <CardDescription>{new Date(video.date).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                    {/* Displaying first few lines as excerpt */}
                    <p className="text-muted-foreground line-clamp-3">
                        {video.content.split('\n').slice(0, 3).join(' ')}...
                    </p>
                    </CardContent>
                    <CardFooter>
                    <Button variant="link" asChild className="p-0"><Link href={`/posts/${slug}`}>Watch Video</Link></Button>
                    </CardFooter>
                </Card>
               );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No videos found.</p>
        )}
      </section>

      <section className="py-12 bg-muted rounded-lg shadow-sm px-6">
         <h2 className="text-3xl font-semibold text-center mb-6">Stay Updated</h2>
         <p className="text-center text-muted-foreground mb-8">Sign up for email updates on new posts and events.</p>
         <div className="max-w-md mx-auto">
           <EmailSignupForm />
         </div>
      </section>
    </div>
  );
}
