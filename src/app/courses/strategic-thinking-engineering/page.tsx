
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Film, FileText, Award, BarChart3, UserCircle } from 'lucide-react';
import Image from 'next/image';

const courseData = {
  title: "Strategic Thinking for Engineering Managers",
  description: "Develop the strategic mindset and skills necessary to drive technology vision, align engineering efforts with business goals, and build high-impact engineering organizations.",
  heroImageHint: "strategy chess future",
  estimatedTime: "25-30 hours",
  format: "Video + Text",
  skillLevel: "Advanced",
  whatYouWillLearn: [
    "Developing and communicating a compelling technology vision",
    "Translating business strategy into engineering initiatives",
    "Long-term planning and roadmap development",
    "Identifying and mitigating strategic risks",
    "Building and scaling high-performing engineering teams",
    "Measuring engineering impact and demonstrating value"
  ],
  modules: [
    { title: "Foundations of Strategic Thinking", description: "Understanding strategic frameworks and their application in tech." },
    { title: "Crafting a Technology Vision and Strategy", description: "Aligning technology with business objectives and future trends." },
    { title: "Strategic Planning and Roadmapping", description: "Techniques for long-term planning and creating actionable roadmaps." },
    { title: "Risk Management and Opportunity Seizing", description: "Identifying strategic risks and capitalizing on emerging opportunities." },
    { title: "Organizational Design and Scaling", description: "Structuring engineering teams for growth and impact." },
    { title: "Measuring Success and Driving Innovation", description: "Defining KPIs, fostering innovation, and communicating engineering value." }
  ],
  instructor: {
    name: "GeePaw Hill",
    bio: "Sharing insights from decades of strategic leadership in software, GeePaw guides engineering managers to think and act more strategically.",
    imageHint: "executive meeting"
  }
};

export default function StrategicThinkingEngineeringPage() {
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
        <h2 className="text-2xl font-semibold mb-4 font-heading">Ready to Think Strategically?</h2>
        <Button size="lg" disabled>Enroll in {title} (Coming Soon)</Button>
      </section>
    </div>
  );
}
