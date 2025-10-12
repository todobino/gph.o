
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock, Filter, Search, Users, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React, { useMemo, useState } from "react";
import { CohortDetailsDialog } from "@/components/courses/cohort-details-dialog";
import type { Course, Cohort } from "@/types/course";

// In a real app, this data would likely come from a CMS or a database
const selfPacedCourses: Course[] = [
  {
    id: "sp-ltc",
    title: "Leading Technical Change",
    slug: "leading-technical-change",
    shortDescription:
      "A course designed to focus on how to make change, not which change to make. Learn to lead your team to stronger, faster, smarter, and happier outcomes.",
    heroImageUrl: "https://picsum.photos/seed/courses-ltc/600/400",
    tags: ["Technical Change", "Agile"],
    type: "self-paced",
    active: true,
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: "sp-tdd",
    title: "Test-Driven Development",
    slug: "test-driven-development",
    shortDescription:
        "Master the art of TDD. Write clean, robust, and maintainable code by writing your tests first. A hands-on workshop for serious programmers.",
    heroImageUrl: "https://picsum.photos/seed/courses-tdd/600/400",
    tags: ["TDD"],
    type: "self-paced",
    active: true,
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
    },
];

const upcomingCohorts: (Cohort & { course: Course })[] = [
  { name: "LTC #13", slug: "ltc-13", description: "Learn to lead change effectively.", sessions: [{startAt: new Date('2024-10-07T13:00:00') as any, endAt: new Date('2024-10-07T15:00:00') as any, label:''}], seatsTotal: 15, seatsConfirmed: 12, course: selfPacedCourses[0] } as any,
  { name: "LTC #14", slug: "ltc-14", description: "The premier change leadership course.", sessions: [{startAt: new Date('2024-11-04T13:00:00') as any, endAt: new Date('2024-11-04T15:00:00') as any, label:''}], seatsTotal: 15, seatsConfirmed: 7, course: selfPacedCourses[0] } as any,
  { name: "TDD #5", slug: "tdd-5", description: "Master Test-Driven Development.", sessions: [{startAt: new Date('2024-12-02T13:00:00') as any, endAt: new Date('2024-12-02T15:00:00') as any, label:''}], seatsTotal: 12, seatsConfirmed: 7, course: selfPacedCourses[1] } as any,
  { name: "LTC #15", slug: "ltc-15", description: "New year, new skills.", sessions: [{startAt: new Date('2025-01-06T13:00:00') as any, endAt: new Date('2025-01-06T15:00:00') as any, label:''}], seatsTotal: 15, seatsConfirmed: 3, course: selfPacedCourses[0] } as any,
  { name: "LTC #16", slug: "ltc-16", description: "Become a change agent.", sessions: [{startAt: new Date('2025-02-03T13:00:00') as any, endAt: new Date('2025-02-03T15:00:00') as any, label:''}], seatsTotal: 15, seatsConfirmed: 3, course: selfPacedCourses[0] } as any,
  { name: "TDD #6", slug: "tdd-6", description: "Write better code, faster.", sessions: [{startAt: new Date('2025-03-03T13:00:00') as any, endAt: new Date('2025-03-03T15:00:00') as any, label:''}], seatsTotal: 12, seatsConfirmed: 2, course: selfPacedCourses[1] } as any,
  { name: "LTC #17", slug: "ltc-17", description: "Lead your team to success.", sessions: [{startAt: new Date('2025-04-07T13:00:00') as any, endAt: new Date('2025-04-07T15:00:00') as any, label:''}], seatsTotal: 20, seatsConfirmed: 5, course: selfPacedCourses[0] } as any,
  { name: "Agile #1", slug: "agile-1", description: "An intro to agile practices.", sessions: [{startAt: new Date('2025-05-05T13:00:00') as any, endAt: new Date('2025-05-05T15:00:00') as any, label:''}], seatsTotal: 20, seatsConfirmed: 0, course: selfPacedCourses[0] } as any,
  { name: "LTC #18", slug: "ltc-18", description: "The classic course, updated.", sessions: [{startAt: new Date('2025-06-02T13:00:00') as any, endAt: new Date('2025-06-02T15:00:00') as any, label:''}], seatsTotal: 20, seatsConfirmed: 0, course: selfPacedCourses[0] } as any,
];

const allTopics = Array.from(new Set(selfPacedCourses.flatMap(c => c.tags || [])));

interface FilterSidebarProps {
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    selectedTopics: string[];
    onSelectedTopicsChange: (topics: string[]) => void;
}

function FilterSidebar({
    searchQuery,
    onSearchQueryChange,
    selectedTopics,
    onSelectedTopicsChange,
}: FilterSidebarProps) {

  const handleTopicChange = (topic: string, checked: boolean) => {
    const newTopics = checked
      ? [...selectedTopics, topic]
      : selectedTopics.filter(t => t !== topic);
    onSelectedTopicsChange(newTopics);
  };
  
  return (
    <aside className="w-full md:w-[280px] md:sticky top-[116px] h-fit">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search courses..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Topic</h3>
            <div className="space-y-2">
              {allTopics.map(topic => (
                <div key={topic} className="flex items-center space-x-2">
                    <Checkbox 
                        id={`topic-${topic}`}
                        checked={selectedTopics.includes(topic)}
                        onCheckedChange={(checked) => handleTopicChange(topic, !!checked)}
                    />
                    <Label htmlFor={`topic-${topic}`} className="font-normal">
                    {topic}
                    </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCohort, setSelectedCohort] = useState<(Cohort & { course: Course }) | null>(null);
    const [cohortPage, setCohortPage] = useState(0);

    const filteredCourses = useMemo(() => {
        return selfPacedCourses.filter(course => {
            const matchesQuery = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                course.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTopics = selectedTopics.length === 0 || selectedTopics.every(topic => course.tags?.includes(topic));
            return matchesQuery && matchesTopics;
        });
    }, [searchQuery, selectedTopics]);

    const handleCohortClick = (cohort: Cohort & { course: Course }) => {
        setSelectedCohort(cohort);
        setIsDialogOpen(true);
    };

    const cohortsPerPage = 4;
    const totalCohortPages = Math.ceil(upcomingCohorts.length / cohortsPerPage);
    const visibleCohorts = upcomingCohorts.slice(
        cohortPage * cohortsPerPage,
        (cohortPage + 1) * cohortsPerPage
    );

  return (
    <div className="space-y-12">
      <CohortDetailsDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        cohort={selectedCohort}
      />
      {/* Upcoming Live Classes - Full Width */}
      <section className="bg-accent p-8 rounded-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Upcoming Live Classes
            </h2>
            <div className="flex items-center gap-2">
                 <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setCohortPage(p => Math.max(0, p - 1))}
                    disabled={cohortPage === 0}
                    aria-label="Previous cohorts"
                 >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                 <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setCohortPage(p => Math.min(totalCohortPages - 1, p + 1))}
                    disabled={cohortPage === totalCohortPages - 1}
                    aria-label="Next cohorts"
                 >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleCohorts.map((cohort) => (
               <Card 
                  key={cohort.slug} 
                  className="w-full h-full flex flex-col hover:shadow-lg hover:border-primary shrink-0 cursor-pointer bg-card"
                  onClick={() => handleCohortClick(cohort)}
                >
                  <CardHeader className="p-4 flex flex-row items-center gap-3 space-y-0 bg-muted/50 border-b">
                      <CalendarDays className="h-6 w-6 text-primary" />
                      <div className="font-semibold">
                        {cohort.sessions[0]?.startAt ? new Date(cohort.sessions[0].startAt as any).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBA'}
                      </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow space-y-2">
                      <CardTitle className="text-lg">{cohort.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">{cohort.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 text-sm text-muted-foreground flex justify-between">
                       <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{cohort.sessions.length} sessions</span>
                      </div>
                       <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4" />
                          <span>{cohort.seatsTotal - cohort.seatsConfirmed} left</span>
                      </div>
                  </CardFooter>
              </Card>
            ))}
        </div>
      </section>

      {/* Main content with sidebar */}
      <div className="grid md:grid-cols-[280px_1fr] gap-8">
        <FilterSidebar 
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            selectedTopics={selectedTopics}
            onSelectedTopicsChange={setSelectedTopics}
        />
        <main className="min-w-0">
          {/* Self-Paced Courses */}
          <section>
            <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              Self-Paced Courses
            </h2>

            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredCourses.map((course) => (
                  <Card
                    key={course.title}
                    className="flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-xl"
                  >
                    <CardHeader className="p-0">
                      <Link href={`/learn/browse/${course.slug}`} className="block group">
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={course.heroImageUrl!}
                            alt={`Image for ${course.title}`}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                            data-ai-hint={course.title}
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            priority={false}
                          />
                        </div>
                      </Link>
                    </CardHeader>

                    <CardContent className="p-6 flex-grow">
                      <CardTitle className="mb-2">
                        <Link href={`/learn/browse/${course.slug}`} className="hover:text-primary">
                          {course.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="break-words">
                        {course.shortDescription}
                      </CardDescription>
                    </CardContent>

                    <CardFooter className="p-6 pt-0">
                      <Button asChild className="w-full">
                        <Link href={`/learn/browse/${course.slug}`}>
                          View Course Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-dashed border-2 rounded-lg">
                <h2 className="text-2xl font-semibold font-heading">No Courses Found</h2>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
