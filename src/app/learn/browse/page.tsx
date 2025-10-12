
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Filter, Search, Users, CalendarDays, BarChart, FileText } from "lucide-react";
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
  {
    title: "Test-Driven Development",
    shortDescription:
        "Master the art of TDD. Write clean, robust, and maintainable code by writing your tests first. A hands-on workshop for serious programmers.",
    slug: "test-driven-development",
    heroImageUrl: "https://picsum.photos/seed/courses-tdd/600/400",
    imageHint: "code on screen",
    },
];

const upcomingCohorts = [
  { name: "LTC #13", date: "Oct 7th, 2024", slug: "ltc-13", description: "Learn to lead change effectively.", sessions: 5, seatsLeft: 3 },
  { name: "LTC #14", date: "Nov 4th, 2024", slug: "ltc-14", description: "The premier change leadership course.", sessions: 5, seatsLeft: 8 },
  { name: "TDD #5", date: "Dec 2nd, 2024", slug: "tdd-5", description: "Master Test-Driven Development.", sessions: 4, seatsLeft: 5 },
  { name: "LTC #15", date: "Jan 6th, 2025", slug: "ltc-15", description: "New year, new skills.", sessions: 5, seatsLeft: 12 },
  { name: "LTC #16", date: "Feb 3rd, 2025", slug: "ltc-16", description: "Become a change agent.", sessions: 5, seatsLeft: 12 },
  { name: "TDD #6", date: "Mar 3rd, 2025", slug: "tdd-6", description: "Write better code, faster.", sessions: 4, seatsLeft: 10 },
  { name: "LTC #17", date: "Apr 7th, 2025", slug: "ltc-17", description: "Lead your team to success.", sessions: 5, seatsLeft: 15 },
  { name: "Agile #1", date: "May 5th, 2025", slug: "agile-1", description: "An intro to agile practices.", sessions: 3, seatsLeft: 20 },
  { name: "LTC #18", date: "Jun 2nd, 2025", slug: "ltc-18", description: "The classic course, updated.", sessions: 5, seatsLeft: 15 },
];

function FilterSidebar() {
  return (
    <aside className="w-full md:w-[280px] md:sticky top-[116px] h-fit">
      <Card>
        <CardContent className="space-y-6 pt-6">
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
    <div className="grid md:grid-cols-[280px_1fr] gap-8">
      <FilterSidebar />
      <main className="space-y-12 min-w-0">
        {/* Upcoming Live Classes */}
        <section>
          <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Upcoming Live Classes
          </h2>

          <ScrollArea className="w-full">
            <div className="flex w-max space-x-4 pb-4">
              {upcomingCohorts.map((cohort) => (
                <Link key={cohort.slug} href={`/learn/cohorts/${cohort.slug}`} className="inline-block">
                    <Card className="w-64 h-full flex flex-col hover:bg-accent transition-colors shrink-0">
                        <CardHeader className="p-4 flex flex-row items-center gap-3 space-y-0 bg-muted/50">
                            <CalendarDays className="h-6 w-6 text-primary" />
                            <div className="font-semibold">{cohort.date.split(',')[0]}</div>
                        </CardHeader>
                        <CardContent className="p-4 flex-grow space-y-2">
                            <CardTitle className="text-lg">{cohort.name}</CardTitle>
                            <p className="text-sm text-muted-foreground line-clamp-2">{cohort.description}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 text-sm text-muted-foreground flex justify-between">
                             <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>{cohort.sessions} sessions</span>
                            </div>
                             <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4" />
                                <span>{cohort.seatsLeft} left</span>
                            </div>
                        </CardFooter>
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
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
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
  );
}

    