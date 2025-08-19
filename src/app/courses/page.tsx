
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const leadingTechnicalChangeCourse = {
    title: 'Leading Technical Change',
    description: 'A course designed to focus on how to make change, not which change to make.',
    slug: 'leading-technical-change',
    imageSeed: 'tech-lead-course',
    category: 'Software Leadership',
    tags: ['Leadership', 'Management', 'Team Building', 'Change'],
    dataAiHint: 'team meeting collaboration'
};

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading">
          Explore Our Courses
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our course designed to elevate your skills in software development and leadership.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card key={leadingTechnicalChangeCourse.slug} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-48">
                <Image
                  src={`https://placehold.co/600x400.png`}
                  alt={`Placeholder for ${leadingTechnicalChangeCourse.title}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-lg"
                  data-ai-hint={leadingTechnicalChangeCourse.dataAiHint}
                />
              </div>
              <CardHeader>
                <CardTitle>{leadingTechnicalChangeCourse.title}</CardTitle>
                <CardDescription className="text-sm text-primary">{leadingTechnicalChangeCourse.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{leadingTechnicalChangeCourse.description}</p>
                 <div className="mt-3 flex flex-wrap gap-2">
                  {leadingTechnicalChangeCourse.tags.map(tag => (
                    <span key={tag} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/courses/${leadingTechnicalChangeCourse.slug}`}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
        </div>
      </section>
      <section className="text-center mt-16">
         <p className="text-muted-foreground">
            More courses coming soon. Stay tuned!
         </p>
      </section>
    </div>
  );
}
