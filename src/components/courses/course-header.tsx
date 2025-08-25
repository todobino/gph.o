
'use client';

import { Clock, Users, Calendar } from 'lucide-react';

interface CourseHeaderProps {
  title: string;
  description: string;
  seats: number;
  duration: string;
  nextCohort: string;
}

export function CourseHeader({ title, description, seats, duration, nextCohort }: CourseHeaderProps) {
  return (
    <section className="bg-accent text-accent-foreground py-12 px-4 rounded-lg shadow-md">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight font-heading">{title}</h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto">
          {description}
        </p>
        <div className="mt-8 flex justify-center items-center gap-x-8 gap-y-4 flex-wrap text-accent-foreground/80">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>{seats} seats per cohort</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Next cohort: {nextCohort}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
