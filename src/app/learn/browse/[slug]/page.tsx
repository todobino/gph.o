
import { UpcomingCourses } from "@/components/courses/upcoming-courses";
import { CourseStats } from "@/components/courses/course-stats";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

// This data would typically be fetched based on the slug
const courseData = {
    title: "Leading Technical Change",
    description: "A course designed to focus on how to make change, not which change to make. Learn to lead your team to stronger, faster, smarter, and happier outcomes.",
    stats: {
        imageUrl: "https://picsum.photos/seed/ltc-course/800/450",
        imageHint: "team working together on a whiteboard",
        seats: 20,
        duration: "5 weeks",
        format: "Remote/Online"
    }
};

export default function CourseBrowsePage({ params }: { params: { slug: string } }) {
  // In a real app, you would fetch course data based on params.slug
  const { title, description, stats } = courseData;

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-3 gap-12 items-start">
        <main className="md:col-span-2 space-y-8">
          <section>
            <h1 className="text-4xl font-bold tracking-tight font-heading mb-4">{title}</h1>
            <p className="text-lg text-foreground/80 leading-relaxed">{description}</p>
          </section>
          
          <Separator />
          
           <section>
            <UpcomingCourses courseSlug={params.slug} />
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-bold font-heading mb-4">What is LTC? - “Better.”</h2>
            <div className="relative aspect-video mb-6">
                <Image
                    src="https://picsum.photos/seed/ltc-better/800/450"
                    alt="A group of people collaborating"
                    fill
                    className="object-cover rounded-lg"
                    data-ai-hint="collaboration team meeting"
                />
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>This is a placeholder for the main course content. You can use markdown here to describe the course in detail.</p>
              <ul>
                <li>How to identify and articulate the need for change.</li>
                <li>Techniques for getting buy-in from your team and stakeholders.</li>
                <li>Strategies for overcoming resistance and navigating organizational politics.</li>
                <li>Practical tools for planning, executing, and measuring the impact of change.</li>
              </ul>
              <p>The course combines theory with hands-on practice, ensuring you walk away with actionable skills you can apply immediately.</p>
            </div>
          </section>
        </main>
        <aside className="md:col-span-1 sticky top-24">
          <CourseStats 
            title={title}
            description={description}
            imageUrl={stats.imageUrl}
            imageHint={stats.imageHint}
            seats={stats.seats}
            duration={stats.duration}
            format={stats.format}
          />
        </aside>
      </div>
    </div>
  );
}
