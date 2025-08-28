
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailSignupForm } from "@/components/email-signup-form";
import { getPosts } from "@/services/posts";
import { ArrowRight, BookOpen, BrainCircuit, GraduationCap, Mic, Speech, Users } from "lucide-react";
import Link from "next/link";
import { PostCard } from "@/components/posts/post-card";

export default async function Home() {
  const allPosts = await getPosts();
  const recentPosts = allPosts.slice(0, 6);
  const recentVideos = allPosts.filter(post => post.tags.includes('video')).slice(0, 6);

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
<section className="relative flex items-center justify-center text-primary-dark-foreground overflow-hidden h-[420px] md:h-[520px] lg:h-[640px]">
  {/* Video layer */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <video
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-auto min-w-full min-h-full object-cover"
      src="https://bt8piafsi9gzsa88.public.blob.vercel-storage.com/gpaw-stage.mp4"
      autoPlay
      muted
      loop
      playsInline
      title="Background Video"
    />
    {/* Legibility overlay (clearly visible) */}
    <div className="absolute inset-0 bg-black/40 md:bg-black/30"></div>
  </div>

  {/* Content */}
  <div className="container mx-auto px-4 text-center relative z-10">
    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 tracking-tight">
      Helping Geeks Produce for Over 40 Years
    </h1>
    <p className="text-lg md:text-xl max-w-3xl mx-auto text-primary-dark-foreground/90 mb-8">
      My mission is to help people learn how to <strong className="underline">embrace change and harvest its value</strong>. Explore hundreds of free articles and videos, then go deeper with my <em>Leading Technical Change</em> courses and coaching.
    </p>
    <div className="flex justify-center gap-4">
      <Button asChild size="lg">
        <Link href="/posts">
          Explore Posts <ArrowRight className="ml-2" />
        </Link>
      </Button>
      <Button asChild size="lg" variant="secondary">
        <Link href="/courses">View Courses</Link>
      </Button>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center justify-between p-6 rounded-lg bg-background dark:bg-background/90 text-foreground border-2 border-blue-600">
              <div>
                <div className="bg-blue-200 dark:bg-blue-800/50 p-4 rounded-full mb-4 inline-block">
                  <BrainCircuit className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-heading">Content</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Deep dives into software development philosophy and practice.
                </p>
              </div>
              <Button asChild size="sm" className="mt-auto bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/posts">See More</Link>
              </Button>
            </div>
            <div className="flex flex-col items-center justify-between p-6 rounded-lg bg-background dark:bg-background/90 text-foreground border-2 border-blue-600">
              <div>
                <div className="bg-blue-200 dark:bg-blue-800/50 p-4 rounded-full mb-4 inline-block">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-heading">Coaching</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Practical guidance on pairing, mobbing, and team culture.
                </p>
              </div>
              <Button asChild size="sm" className="mt-auto bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/coaching">See More</Link>
              </Button>
            </div>
            <div className="flex flex-col items-center justify-between p-6 rounded-lg bg-background dark:bg-background/90 text-foreground border-2 border-blue-600">
              <div>
                <div className="bg-blue-200 dark:bg-blue-800/50 p-4 rounded-full mb-4 inline-block">
                  <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-heading">Courses</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Structured learning to help your team master essential skills.
                </p>
              </div>
              <Button asChild size="sm" className="mt-auto bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/courses">See More</Link>
              </Button>
            </div>
             <div className="flex flex-col items-center justify-between p-6 rounded-lg bg-background dark:bg-background/90 text-foreground border-2 border-blue-600">
              <div>
                <div className="bg-blue-200 dark:bg-blue-800/50 p-4 rounded-full mb-4 inline-block">
                  <Speech className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-heading">Speaking</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Engaging keynotes and conference talks on software and teams.
                </p>
              </div>
               <Button asChild size="sm" className="mt-auto bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/speaking">See More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-heading">
            Latest Posts
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} className="bg-white" />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/posts">View All Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New Self-Paced Course Signup Section */}
      <section className="py-20 md:py-28 bg-primary-dark text-primary-dark-foreground">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 font-heading italic">Psst...</h2>
            <p className="text-lg md:text-xl text-primary-dark-foreground/80">Self-paced online course coming soon.</p>
            <p className="text-lg md:text-xl text-primary-dark-foreground/80 mb-8">Sign up to get an early access discount.</p>
            <div className="max-w-md mx-auto">
              <EmailSignupForm
                buttonText="Sign me up!"
                listId="selfPacedCourse"
                formClassName="[&_input]:bg-background/90 [&_input]:text-foreground [&_input:focus]:bg-background [&_input::placeholder]:text-muted-foreground"
                buttonClassName="bg-primary hover:bg-primary/90 text-primary-foreground"
              />
            </div>
        </div>
      </section>

      {/* Latest Videos Section */}
      {recentVideos.length > 0 && (
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-heading">
              Latest Videos
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {recentVideos.map((post) => (
                <PostCard key={post.slug} post={post} className="bg-white" />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild variant="outline">
                <Link href="/posts?tag=video">View All Videos</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA / Signup Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
            <Card className="bg-card text-card-foreground max-w-3xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Stay Updated</CardTitle>
                    <CardDescription>
                        Get the latest articles, videos, and course announcements delivered right to your inbox. No spam, ever.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-md mx-auto">
                        <EmailSignupForm
                           buttonClassName="bg-primary hover:bg-primary/90 text-primary-foreground"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
