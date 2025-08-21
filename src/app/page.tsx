
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailSignupForm } from "@/components/email-signup-form";
import { getPosts } from "@/services/posts";
import { ArrowRight, BookOpen, BrainCircuit, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostCard } from "./(marketing)/posts/components/post-card";

export default async function Home() {
  const recentPosts = await getPosts().then(posts => posts.slice(0, 3));

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-primary-dark text-primary-dark-foreground py-20 md:py-32">
        <div className="absolute inset-0">
           <Image 
            src="https://placehold.co/1600x900.png"
            alt="Abstract background image"
            data-ai-hint="abstract technology"
            fill
            className="object-cover opacity-10"
           />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 tracking-tight">
            Cultivating Change, Harvesting Value
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-primary-dark-foreground/80 mb-8">
            Helping software teams discover, practice, and celebrate better ways of working together. Explore tidbits on TDD, refactoring, and agile teamwork.
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
