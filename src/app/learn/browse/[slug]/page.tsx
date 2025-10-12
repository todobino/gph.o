
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
              <p>How can we help our software teams get stronger? Faster? Smarter? Happier? More positive and more productive?</p>
              <p>There are lots of ideas about what changes we might desire to make, ranging from process to policy to procedure to skillset. There’s no problem in finding proposed changes. No, the problem is in helping your team to actually make any given change.</p>
              <p>Leading Technical Change (LTC), is a course designed to focus on how to make change, not which change to make.</p>
              <p>Download the LTC Overview for your team lead or department head today! 👇</p>
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
