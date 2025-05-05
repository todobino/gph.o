
import type { Post } from '@/services/github'; // Renamed type definition
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { EmailSignupForm } from '@/components/email-signup-form';
import { getPosts } from '@/services/github'; // Renamed function
import { cn } from '@/lib/utils'; // Import cn

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
      {/* Updated Hero Section */}
      <section className="py-16 bg-secondary rounded-lg shadow-sm overflow-hidden"> {/* Added overflow-hidden */}
        <div className="container mx-auto px-4"> {/* Ensure container padding */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12"> {/* Flex container */}
            {/* Left Column: Image */}
            <div className="w-full md:w-1/3 flex-shrink-0"> {/* Image column */}
              <Image
                src="https://picsum.photos/seed/geepaw-hero/400/400" // Placeholder image
                alt="Placeholder image for GeePawHill"
                width={400}
                height={400}
                className="rounded-lg object-cover w-full h-auto shadow-md" // Make image responsive and add shadow
                data-ai-hint="portrait professional technology"
              />
            </div>
             {/* Right Column: Text and Button */}
            <div className="w-full md:w-2/3 text-center md:text-left"> {/* Text column */}
              <h1 className="text-4xl font-bold tracking-tight mb-4">Helping Geeks Produce for Over 40 Years.</h1>
              <p className="text-xl text-muted-foreground mb-8">
                My mission is to help people learn how to embrace change and harvest its value. Here, you'll find hundreds of free articles and videos—from deep technical insights to big-picture philosophy—all designed to help you turn transformation into your greatest advantage. Ready to create lasting change at work? Book a solo or group Coaching Session below and start change-harvesting today.
              </p>
               {/* Apply button styles directly to the Link */}
               <Link href="/booking" className={cn(buttonVariants({ size: "lg" }))}>Let's Work Together</Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6">Latest Videos</h2>
        {latestVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestVideos.map((video) => {
               // Use the pre-generated slug from the post object
               const slug = video.slug;
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
                       {/* Use Link styled as button variant 'link' */}
                       <Link href={`/posts/${slug}`} className={cn(buttonVariants({ variant: "link", className: "p-0" }))}>
                         Watch Video
                       </Link>
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
