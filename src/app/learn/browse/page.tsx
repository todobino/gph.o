
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Filter, Search, Users, CalendarDays, BarChart, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React, { useMemo, useState } from "react";

// In a real app, this data would likely come from a CMS or a database
const selfPacedCourses = [
  {
    title: "Leading Technical Change",
    shortDescription:
      "A course designed to focus on how to make change, not which change to make. Learn to lead your team to stronger, faster, smarter, and happier outcomes.",
    slug: "leading-technical-change",
    heroImageUrl: "https://picsum.photos/seed/courses-ltc/600/400",
    imageHint: "team brainstorming session",
    topics: ["Technical Change", "Agile"],
  },
  {
    title: "Test-Driven Development",
    shortDescription:
        "Master the art of TDD. Write clean, robust, and maintainable code by writing your tests first. A hands-on workshop for serious programmers.",
    slug: "test-driven-development",
    heroImageUrl: "https://picsum.photos/seed/courses-tdd/600/400",
    imageHint: "code on screen",
    topics: ["TDD"],
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

const allTopics = Array.from(new Set(selfPacedCourses.flatMap(c => c.topics)));

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

    const filteredCourses = useMemo(() => {
        return selfPacedCourses.filter(course => {
            const matchesQuery = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTopics = selectedTopics.length === 0 || selectedTopics.every(topic => course.topics.includes(topic));
            return matchesQuery && matchesTopics;
        });
    }, [searchQuery, selectedTopics]);

  return (
    <div className="space-y-12">
      {/* Upcoming Live Classes - Full Width */}
      <section>
        <h2 className="text-2xl font-bold font-heading mb-4 flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Upcoming Live Classes
        </h2>

        <ScrollArea className="w-full">
          <div className="flex w-max space-x-4 pb-4">
            {upcomingCohorts.map((cohort) => (
              <Link key={cohort.slug} href={`/learn/cohorts/${cohort.slug}`} className="inline-block">
                  <Card className="w-64 h-full flex flex-col hover:shadow-lg hover:border-primary transition-all duration-150 ease-in-out shrink-0">
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
