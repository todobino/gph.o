
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { UpcomingCourses } from "@/components/courses/upcoming-courses";

// In a real app, this data would likely come from a CMS or a database
const courses = [
  {
    title: "Leading Technical Change",
    description: "A course designed to focus on how to make change, not which change to make. Learn to lead your team to stronger, faster, smarter, and happier outcomes.",
    href: "/courses/leading-technical-change",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "team brainstorming session"
  },
  // Add more courses here as they become available
];

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-heading">Our Courses</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Go deeper with structured learning designed to help your team master essential skills in software development and leadership.
        </p>
      </div>

      <UpcomingCourses />

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-12 font-heading">Self-Paced Learning</h2>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.title} className="flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-xl">
                <CardHeader className="p-0">
                  <Link href={course.href} className="block group">
                    <div className="relative aspect-video">
                      <Image
                        src={course.imageUrl}
                        alt={`Image for ${course.title}`}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        data-ai-hint={course.imageHint}
                      />
                    </div>
                  </Link>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <CardTitle className="mb-2">
                    <Link href={course.href} className="hover:text-primary">
                      {course.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href={course.href}>
                      View Course Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-dashed border-2 rounded-lg">
            <h2 className="text-2xl font-semibold font-heading">More Courses Coming Soon</h2>
            <p className="mt-2 text-muted-foreground">
              We're busy developing new content. Check back later for more courses!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
