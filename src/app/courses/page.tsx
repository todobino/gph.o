
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const softwareCourses = [
  {
    title: 'Advanced React Patterns',
    description: 'Master advanced React concepts, patterns, and best practices for building scalable applications.',
    slug: 'advanced-react-patterns',
    imageSeed: 'react-course',
    category: 'Software Development',
    tags: ['React', 'Frontend', 'Advanced'],
    dataAiHint: 'abstract code illustration'
  },
  {
    title: 'Modern Backend Development with Node.js',
    description: 'Explore modern backend techniques using Node.js, Express, and database integrations.',
    slug: 'modern-backend-nodejs',
    imageSeed: 'nodejs-course',
    category: 'Software Development',
    tags: ['Node.js', 'Backend', 'API'],
    dataAiHint: 'server database diagram'
  },
  {
    title: 'Full-Stack TypeScript Mastery',
    description: 'Become proficient in TypeScript for both frontend and backend development workflows.',
    slug: 'fullstack-typescript',
    imageSeed: 'typescript-course',
    category: 'Software Development',
    tags: ['TypeScript', 'Full-Stack', 'Web Development'],
    dataAiHint: 'typescript logo code'
  },
];

const leadershipCourses = [
  {
    title: 'Effective Technical Leadership',
    description: 'Learn to lead technical teams, manage projects, and foster a culture of innovation.',
    slug: 'effective-technical-leadership',
    imageSeed: 'tech-lead-course',
    category: 'Software Leadership',
    tags: ['Leadership', 'Management', 'Team Building'],
    dataAiHint: 'team meeting collaboration'
  },
  {
    title: 'Agile Project Management for Software Teams',
    description: 'Implement Agile methodologies to improve team productivity and project outcomes.',
    slug: 'agile-project-management',
    imageSeed: 'agile-course',
    category: 'Software Leadership',
    tags: ['Agile', 'Project Management', 'Scrum'],
    dataAiHint: 'agile board sticky notes'
  },
  {
    title: 'Strategic Thinking for Engineering Managers',
    description: 'Develop strategic thinking skills to drive technology vision and business alignment.',
    slug: 'strategic-thinking-engineering',
    imageSeed: 'strategy-course',
    category: 'Software Leadership',
    tags: ['Strategy', 'Engineering Management', 'Vision'],
    dataAiHint: 'chess pieces strategy board'
  },
];

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Explore Our Courses
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover a range of courses designed to elevate your skills in software development and leadership.
          Browse our catalog and find the perfect course to advance your career.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-8">Advanced Software Development</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {softwareCourses.map((course) => (
            <Card key={course.slug} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-48">
                <Image
                  src={`https://placehold.co/600x400.png`}
                  alt={`Placeholder for ${course.title}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-lg"
                  data-ai-hint={course.dataAiHint}
                />
              </div>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription className="text-sm text-primary">{course.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{course.description}</p>
                 <div className="mt-3 flex flex-wrap gap-2">
                  {course.tags.map(tag => (
                    <span key={tag} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/courses/${course.slug}`}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-8">Software Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leadershipCourses.map((course) => (
            <Card key={course.slug} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
               <div className="relative w-full h-48">
                <Image
                  src={`https://placehold.co/600x400.png`}
                  alt={`Placeholder for ${course.title}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-lg"
                   data-ai-hint={course.dataAiHint}
                />
              </div>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                 <CardDescription className="text-sm text-primary">{course.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{course.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {course.tags.map(tag => (
                    <span key={tag} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/courses/${course.slug}`}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
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
