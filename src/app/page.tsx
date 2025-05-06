
import React, { ReactNode } from 'react';

import type { Post } from '@/services/posts'; // Updated import path
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { EmailSignupForm } from '@/components/email-signup-form';
import { getPosts } from '@/services/posts'; // Updated import path
import { cn } from '@/lib/utils'; // Import cn

// Function to get videos (filters from all posts)
async function getLatestVideos(): Promise<Post[]> { // Use renamed Post type
  const allPosts = await getPosts(); // Use renamed function
  // Filter posts by a 'video' tag
  return allPosts.filter(post => post.tags.includes('video')).slice(0, 3);
}

// Function to get the most recent posts
async function getRecentPosts(): Promise<Post[]> {
  const allPosts = await getPosts();
  return allPosts.slice(0, 9); // Get the latest 9 posts
}


export default async function Home() {
  const latestVideos = await getLatestVideos();
  const recentPosts = await getRecentPosts();

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
              {/* Updated body text with two paragraphs */}
               <p className="text-xl text-muted-foreground mb-8">
                 My mission is to help people learn how to embrace change and harvest its value. Here, you'll find hundreds of free articles and videos—from deep technical insights to big-picture philosophy—all designed to help you turn transformation into your greatest advantage. Ready to create lasting change at work? Book a solo or group Coaching Session below and start change-harvesting today.
               </p>
               {/* Apply button styles directly to the Link */}
               <Link href="/booking" className={cn(buttonVariants({ size: "lg" }))}>Let's Work Together</Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Recent Posts Section */}
       <section>
         <h2 className="text-3xl font-semibold mb-6">Recent Posts</h2>
         {recentPosts.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {recentPosts.map((post) => {
               const slug = post.slug;
               return (
                 <Link key={post.slug} href={`/posts/${slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
                   <Card className="flex flex-col h-full transition-colors duration-200 border border-border group-hover:border-primary"> {/* Use slug for key, add group hover styles */}
                     <CardHeader>
                       {/* Placeholder image */}
                       <div className="aspect-video overflow-hidden rounded-t-lg">
                           <Image
                               src={`https://picsum.photos/seed/${slug}/400/200`} // Use slug for placeholder seed
                               alt={`Thumbnail for ${post.title}`}
                               width={400}
                               height={200}
                               className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" // Added hover scale effect
                               data-ai-hint="blog post abstract tech" // More specific hint
                           />
                       </div>
                       <CardTitle className="mt-4">{post.title}</CardTitle>
                       <CardDescription>{new Date(post.date).toLocaleDateString()}</CardDescription>
                     </CardHeader>
                     <CardContent className="flex-grow">
                       <p className="text-muted-foreground line-clamp-3">
                         {post.content.split('\n').slice(0, 3).join(' ')}...
                       </p>
                     </CardContent>
                     <CardFooter>
                       <span className={cn(buttonVariants({ variant: "link", className: "p-0 pointer-events-none" }))}> {/* Keep style but remove interactivity */}
                          Read More
                       </span>
                     </CardFooter>
                   </Card>
                  </Link>
               );
             })}
           </div>
         ) : (
           <p className="text-muted-foreground">No posts found.</p>
         )}
       </section>

      {/* Existing Latest Videos Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-6">Latest Videos</h2>
        {latestVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestVideos.map((video) => {
               // Use the pre-generated slug from the post object
               const slug = video.slug;
               return (
                 <Link key={video.slug} href={`/posts/${slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
                  <Card className="flex flex-col h-full transition-colors duration-200 border border-border group-hover:border-primary"> {/* Use slug for key, add group hover styles */}
                      <CardHeader>
                      {/* Placeholder image */}
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                          <Image
                              src={`https://picsum.photos/seed/${slug}/400/200`} // Use slug for placeholder seed
                              alt={`Thumbnail for ${video.title}`}
                              width={400}
                              height={200}
                              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" // Added hover scale effect
                              data-ai-hint="video thumbnail abstract tech"
                          />
                      </div>
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
                         {/* Keep style but remove interactivity */}
                         <span className={cn(buttonVariants({ variant: "link", className: "p-0 pointer-events-none" }))}>
                           Watch Video
                         </span>
                      </CardFooter>
                  </Card>
                  </Link>
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

    