
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailSignupForm } from "@/components/email-signup-form";
import { getPosts } from "@/services/posts";
import { ArrowRight, BookOpen, BrainCircuit, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/posts/post-card";

export default async function Home() {
  const recentPosts = await getPosts().then(posts => posts.slice(0, 6));

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center text-primary-dark-foreground overflow-hidden min-h-[calc(100dvh-3.5rem)]">
        <div className="absolute inset-0 z-0">
           <iframe
                className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
                src="https://www.youtube.com/embed/lNpof6rRB9U?autoplay=1&mute=1&loop=1&playlist=lNpof6rRB9U&controls=0&showinfo=0&modestbranding=1&start=327"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Background Video"
           ></iframe>
           <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 tracking-tight">
            Helping Geeks Produce for Over 40 Years
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-primary-dark-foreground/80 mb-8">
            My mission is to help people learn how to embrace change and harvest its value. Here you will find hundreds of free articles and videos covering software topics ranging from highly technical to broadly philosophical.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/posts">
                Explore Posts <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/courses">
                View Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-accent p-4 rounded-full mb-4">
                 <BrainCircuit className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Expert Insights</h3>
              <p className="text-muted-foreground">
                Deep dives into technical practices and software development philosophy from decades of experience.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-accent p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Team Coaching</h3>
              <p className="text-muted-foreground">
                Practical guidance on mob programming, pairing, and fostering effective, collaborative team cultures.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-accent p-4 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Hands-On Courses</h3>
              <p className="text-muted-foreground">
                Structured learning to help your team master essential skills for sustainable development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-heading">
            Latest Tidbits
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
