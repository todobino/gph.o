import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Filter, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// In a real app, this data would likely come from a CMS or a database
const selfPacedCourses = [
  {
    title: "Leading Technical Change",
    shortDescription:
      "A course designed to focus on how to make change, not which change to make. Learn to lead your team to stronger, faster, smarter, and happier outcomes.",
    slug: "leading-technical-change",
    heroImageUrl: "https://picsum.photos/seed/courses-ltc/600/400",
    imageHint: "team brainstorming session",
  },
];

const upcomingCohorts = [
  { name: "LTC #13", date: "Oct 7th, 2024", slug: "ltc-13" },
  { name: "LTC #14", date: "Nov 4th, 2024", slug: "ltc-14" },
  { name: "TDD #5", date: "Dec 2nd, 2024", slug: "tdd-5" },
  { name: "LTC #15", date: "Jan 6th, 2025", slug: "ltc-15" },
  { name: "LTC #16", date: "Feb 3rd, 2025", slug: "ltc-16" },
  { name: "TDD #6", date: "Mar 3rd, 2025", slug: "tdd-6" },
  { name: "LTC #17", date: "Apr 7th, 2025", slug: "agile-1" },
  { name: "Agile #1", date: "May 5th, 2025", slug: "agile-1" },
  { name: "LTC #18", date: "Jun 2nd, 2025", slug: "ltc-18" },
];

function FilterSidebar() {
  return (
    <aside className="w-full md:w-[280px] md:sticky top-24 h-fit">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-10" />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Format</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="format-live" />
                <Label htmlFor="format-live" className="font-normal">
                  Live Cohort
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="format-self-paced" />
                <Label htmlFor="format-self-paced" className="font-normal">
                  Self-Paced
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="format-in-person" />
                <Label htmlFor="format-in-person" className="font-normal">
                  In-Person
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Topic</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="topic-change" />
                <Label htmlFor="topic-change" className="font-normal">
                  Technical Change
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="topic-tdd" />
                <Label htmlFor="topic-tdd" className="font-normal">
                  TDD
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="topic-agile" />
                <Label htmlFor="topic-agile" className="font-normal">
                  Agile
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

export default function CoursesPage() {
  return (
    // Prevent any accidental horizontal page overflow
    <div className="container mx-auto px-4 py-8 overflow-x-hidden">
      <div className="grid md:grid-cols-[280px_1fr] gap-8">
        <FilterSidebar />
        <main className="space-y-12">
          {/* Upcoming Live Classes */}
          <section>
            <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Upcoming Live Classes
            </h2>

            {/* The key to horizontal-only scroll:
                - ScrollArea gets a normal width
                - Inner track is w-max so it can grow beyond the viewport
                - Each card is shrink-0 so it won’t collapse
                - No `whitespace-nowrap` on the container to avoid page overflow */}
            <ScrollArea className="w-full">
              <div className="flex w-max gap-4 pb-2 pr-4">
                {upcomingCohorts.map((cohort) => (
                  <Link key={cohort.slug} href={`/learn/cohorts/${cohort.slug}`} className="inline-block">
                    <Card className="w-44 h-44 flex flex-col items-center justify-center text-center p-4 hover:bg-accent transition-colors shrink-0">
                      <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                        <h3 className="text-xl font-bold font-heading">{cohort.name}</h3>
                        <p className="text-sm text-muted-foreground">{cohort.date}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>

          {/* Self-Paced Courses */}
          <section>
            <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              Self-Paced Courses
            </h2>

            {selfPacedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {selfPacedCourses.map((course) => (
                  <Card
                    key={course.title}
                    className="flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-xl"
                  >
                    <CardHeader className="p-0">
                      <Link href={`/learn/courses/${course.slug}`} className="block group">
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={course.heroImageUrl}
                            alt={`Image for ${course.title}`}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                            data-ai-hint={course.imageHint}
                            sizes="(min-width: 768px) 50vw, 100vw"
                            priority={false}
                          />
                        </div>
                      </Link>
                    </CardHeader>

                    <CardContent className="p-6 flex-grow">
                      <CardTitle className="mb-2">
                        <Link href={`/learn/courses/${course.slug}`} className="hover:text-primary">
                          {course.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="break-words">
                        {course.shortDescription}
                      </CardDescription>
                    </CardContent>

                    <CardFooter className="p-6 pt-0">
                      <Button asChild className="w-full">
                        <Link href={`/learn/courses/${course.slug}`}>
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
          </section>
        </main>
      </div>
    </div>
  );
}