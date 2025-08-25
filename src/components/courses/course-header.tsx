
'use client';

import { Clock, Users, Calendar, Video } from 'lucide-react';

interface CourseHeaderProps {
  title: string;
  description: string;
}

export function CourseHeader({ title, description }: CourseHeaderProps) {
  return (
    <section className="bg-primary text-primary-foreground py-12 px-4 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold tracking-tight font-heading">{title}</h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto text-primary-foreground/90">
          {description}
        </p>
    </section>
  );
}
