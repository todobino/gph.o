
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Film, FileText, Award, BarChart3, UserCircle } from 'lucide-react';
import Image from 'next/image';

const courseData = {
  title: "Advanced React Patterns",
  description: "Master advanced React concepts, patterns, and best practices for building scalable and maintainable applications. Go beyond the basics and learn how to write professional-grade React code.",
  heroImageHint: "react code abstract",
  estimatedTime: "25-30 hours",
  format: "Video + Text",
  skillLevel: "Advanced",
  whatYouWillLearn: [
    "Advanced Hooks (useReducer, useContext, custom hooks)",
    "State Management Patterns (Context API, Zustand/Redux basics)",
    "Component Design Patterns (Render Props, HOCs, Compound Components)",
    "Performance Optimization Techniques (memo, useMemo, useCallback, code splitting)",
    "Testing Strategies for Complex Applications (React Testing Library, Jest)",
    "Working with Server Components and Server Actions in Next.js"
  ],
  modules: [
    { title: "Revisiting React Fundamentals", description: "Quick review of core concepts and setting up the advanced environment." },
    { title: "Deep Dive into Hooks", description: "Exploring useReducer, useContext, useRef, and building powerful custom Hooks." },
    { title: "Advanced Component Patterns", description: "Understanding and implementing Render Props, Higher-Order Components, and Compound Components." },
    { title: "State Management at Scale", description: "Strategies for managing complex application state effectively." },
    { title: "Performance Optimization", description: "Identifying bottlenecks and applying techniques to speed up your React apps." },
    { title: "Testing and Debugging", description: "Best practices for testing React components and applications." },
    { title: "React with Next.js 14+", description: "Leveraging Server Components, Server Actions, and advanced Next.js features." }
  ],
  instructor: {
    name: "GeePaw Hill",
    bio: "With decades of experience in software development, GeePaw Hill brings practical insights into advanced React development.",
    imageHint: "instructor teaching"
  }
};

export default function AdvancedReactPatternsPage() {
  const { title, description, heroImageHint, estimatedTime, format, skillLevel, whatYouWillLearn, modules, instructor } = courseData;

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 md:p-16 rounded-lg shadow-xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <Button size="lg" variant="secondary" disabled>
          Enroll Now (Coming Soon)
        </Button>
      </section>

      <section className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-3xl font-semibold">What You'll Learn</h2>
          <ul className="space-y-3">
            {whatYouWillLearn.map((item, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <Card className="shadow-lg sticky top-24">
          <CardHeader>
             <div className="relative w-full h-40 mb-4 rounded-t-lg overflow-hidden">
                <Image
                  src={`https://placehold.co/600x300.png`}
                  alt={`${title} abstract image`}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={heroImageHint}
                />
              </div>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-sm">
              <Clock className="h-5 w-5 text-muted-foreground mr-2" />
              <span><strong>Time:</strong> {estimatedTime}</span>
            </div>
            <div className="flex items-center text-sm">
              {format.includes("Video") ? <Film className="h-5 w-5 text-muted-foreground mr-2" /> : <FileText className="h-5 w-5 text-muted-foreground mr-2" />}
              <span><strong>Format:</strong> {format}</span>
            </div>
            <div className="flex items-center text-sm">
              <BarChart3 className="h-5 w-5 text-muted-foreground mr-2" />
              <span><strong>Level:</strong> {skillLevel}</span>
            </div>
             <div className="flex items-center text-sm">
              <Award className="h-5 w-5 text-muted-foreground mr-2" />
              <span>Certificate of Completion</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6">Course Content</h2>
        <div className="space-y-4">
          {modules.map((module, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow bg-card">
              <CardHeader>
                <CardTitle className="text-xl">Module {index + 1}: {module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted p-8 rounded-lg mt-12">
        <h2 className="text-3xl font-semibold mb-6 text-center">Meet Your Instructor</h2>
        <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-8 max-w-3xl mx-auto">
          <Image
            src={`https://placehold.co/200x200.png`}
            alt={`Portrait of ${instructor.name}`}
            width={150}
            height={150}
            className="rounded-full shadow-md object-cover aspect-square"
            data-ai-hint={instructor.imageHint}
          />
          <div>
            <h3 className="text-2xl font-semibold mb-2">{instructor.name}</h3>
            <p className="text-muted-foreground">{instructor.bio}</p>
          </div>
        </div>
      </section>

      <section className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-4">Ready to Master Advanced React?</h2>
        <Button size="lg" disabled>Enroll in {title} (Coming Soon)</Button>
      </section>
    </div>
  );
}
