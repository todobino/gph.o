
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Film, FileText, Award, BarChart3, UserCircle } from 'lucide-react';
import Image from 'next/image';

const courseData = {
  title: "Modern Backend Development with Node.js",
  description: "Build robust, scalable, and secure backend services using Node.js, Express.js, and modern best practices. Learn to design APIs, interact with databases, and deploy your applications.",
  heroImageHint: "nodejs server cloud",
  estimatedTime: "30-35 hours",
  format: "Video + Text",
  skillLevel: "Intermediate",
  whatYouWillLearn: [
    "Building RESTful APIs with Express.js",
    "Asynchronous JavaScript (Promises, async/await)",
    "Database integration (MongoDB with Mongoose, PostgreSQL with Sequelize/Prisma)",
    "Authentication and Authorization (JWT, OAuth)",
    "Testing backend applications (Jest, Supertest)",
    "Deployment strategies (Docker, Cloud Platforms)"
  ],
  modules: [
    { title: "Node.js and Express.js Fundamentals", description: "Getting started with Node.js, NPM, and building your first Express server." },
    { title: "API Design and RESTful Principles", description: "Learn to design clean, efficient, and scalable APIs." },
    { title: "Working with Databases", description: "Connecting to and interacting with NoSQL (MongoDB) and SQL (PostgreSQL) databases." },
    { title: "Authentication and Security", description: "Implementing secure authentication and authorization mechanisms." },
    { title: "Testing Your Backend", description: "Writing unit and integration tests for your Node.js applications." },
    { title: "Deployment and DevOps Basics", description: "Preparing and deploying your backend services to the cloud." }
  ],
  instructor: {
    name: "Guest Expert",
    bio: "An industry expert in backend technologies and Node.js development.",
    imageHint: "developer coding"
  }
};

export default function ModernBackendNodejsPage() {
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
        <h2 className="text-2xl font-semibold mb-4">Ready to Build Modern Backends?</h2>
        <Button size="lg" disabled>Enroll in {title} (Coming Soon)</Button>
      </section>
    </div>
  );
}
