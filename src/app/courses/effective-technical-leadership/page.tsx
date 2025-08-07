
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Film, FileText, Award, BarChart3, UserCircle } from 'lucide-react';
import Image from 'next/image';

const courseData = {
  title: "Effective Technical Leadership",
  description: "Learn the essential skills to lead technical teams, manage complex projects, and foster a culture of innovation and collaboration. Transition from a senior developer to an impactful tech lead.",
  heroImageHint: "leadership team strategy",
  estimatedTime: "20-25 hours",
  format: "Video + Text",
  skillLevel: "Intermediate to Advanced",
  whatYouWillLearn: [
    "Principles of technical leadership and team motivation",
    "Effective communication and conflict resolution",
    "Project planning, estimation, and risk management",
    "Mentoring and growing team members",
    "Driving technical excellence and making sound architectural decisions",
    "Balancing technical debt and feature delivery"
  ],
  modules: [
    { title: "The Role of a Tech Lead", description: "Understanding the responsibilities and expectations of technical leadership." },
    { title: "Communication and Collaboration", description: "Techniques for clear communication, active listening, and fostering teamwork." },
    { title: "Project Management for Tech Leads", description: "Planning, delegating tasks, tracking progress, and managing stakeholders." },
    { title: "Mentoring and Team Development", description: "Guiding and developing the skills of your team members." },
    { title: "Technical Strategy and Decision Making", description: "Architectural best practices and making informed technical choices." },
    { title: "Cultivating a Healthy Team Culture", description: "Building an inclusive, supportive, and high-performing team environment." }
  ],
  instructor: {
    name: "GeePaw Hill",
    bio: "Drawing from years of coaching and leading software teams, GeePaw provides actionable strategies for effective technical leadership.",
    imageHint: "team discussion"
  }
};

export default function EffectiveTechnicalLeadershipPage() {
  const { title, description, heroImageHint, estimatedTime, format, skillLevel, whatYouWillLearn, modules, instructor } = courseData;

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 md:p-16 rounded-lg shadow-xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading">{title}</h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <Button size="lg" variant="secondary" disabled>
          Enroll Now (Coming Soon)
        </Button>
      </section>

      <section className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-3xl font-semibold font-heading">What You'll Learn</h2>
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
        <h2 className="text-3xl font-semibold mb-6 font-heading">Course Content</h2>
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
        <h2 className="text-3xl font-semibold mb-6 text-center font-heading">Meet Your Instructor</h2>
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
            <h3 className="text-2xl font-semibold mb-2 font-heading">{instructor.name}</h3>
            <p className="text-muted-foreground">{instructor.bio}</p>
          </div>
        </div>
      </section>

      <section className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-4 font-heading">Ready to Lead with Impact?</h2>
        <Button size="lg" disabled>Enroll in {title} (Coming Soon)</Button>
      </section>
    </div>
  );
}
