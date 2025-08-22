
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailSignupForm } from "@/components/email-signup-form";
import { getPosts } from "@/services/posts";
import { ArrowRight, BookOpen, BrainCircuit, Mic, Users } from "lucide-react";
import Link from "next/link";
import { PostCard } from "@/components/posts/post-card";

export default async function Home() {
  const recentPosts = await getPosts().then(posts => posts.slice(0, 6));

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
<section className="relative flex items-center justify-center text-primary-dark-foreground overflow-hidden h-[420px] md:h-[520px] lg:h-[640px]">
  {/* Video layer */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    {/* Make the 16:9 iframe fill/cover the container without bars */}
    <iframe
      className="
        absolute top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2
        /* Keep 16:9, but oversize so it covers in both directions */
        w-[100vw] h-[56.25vw]      /* 56.25vw = 9/16 of viewport width */
        min-w-full min-h-full      /* if the above isn't enough, stretch further */
      "
      src="https://www.youtube.com/embed/lNpof6rRB9U?autoplay=1&mute=1&loop=1&playlist=lNpof6rRB9U&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1&start=327"
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
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
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center justify-between p-6 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <div>
                <div className="bg-blue-200 dark:bg-blue-800/50 p-4 rounded-full mb-4 inline-block">
                  <BrainCircuit className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-heading">Content</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Deep dives into software development philosophy and practice.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-auto">
                <Link href="/posts">Go To Posts</Link>
              </Button>
            </div>
            <div className="flex flex-col items-center justify-between p-6 rounded-lg bg-green-100 dark:bg-green-900/30">
              <div>
                <div className="bg-green-200 dark:bg-green-800/50 p-4 rounded-full mb-4 inline-block">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-heading">Coaching</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Practical guidance on pairing, mobbing, and team culture.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-auto">
                <Link href="/coaching">Go To Coaching</Link>
              </Button>
            </div>
            <div className="flex flex-col items-center justify-between p-6 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <div>
                <div className="bg-orange-200 dark:bg-orange-800/50 p-4 rounded-full mb-4 inline-block">
                  <BookOpen className="h-8 w-8 text-orange-600 dark:text-orange-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-heading">Courses</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Structured learning to help your team master essential skills.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-auto">
                <Link href="/courses">Go To Courses</Link>
              </Button>
            </div>
             <div className="flex flex-col items-center justify-between p-6 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <div>
                <div className="bg-purple-200 dark:bg-purple-800/50 p-4 rounded-full mb-4 inline-block">
                  <Mic className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-heading">Speaking</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Engaging keynotes and conference talks on software and teams.
                </p>
              </div>
               <Button asChild variant="outline" size="sm" className="mt-auto">
                <Link href="/speaking">Go To Speaking</Link>
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
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/posts">View All Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA / Signup Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
            <Card className="bg-primary/5 border-primary/20 max-w-3xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Stay Updated</CardTitle>
                    <CardDescription>
                        Get the latest articles, videos, and course announcements delivered right to your inbox. No spam, ever.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-md mx-auto">
                        <EmailSignupForm />
                    </div>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
