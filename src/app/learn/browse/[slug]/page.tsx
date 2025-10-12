

import { UpcomingCourses } from "@/components/courses/upcoming-courses";
import { CourseStats } from "@/components/courses/course-stats";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { DownloadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const courseOutlineUrl = "https://firebasestorage.googleapis.com/v0/b/gph-o-2ee61.firebasestorage.app/o/appData%2FLTC-Overview.pdf?alt=media&token=f6f256a3-7c57-4b46-b569-093e830bb3ab";

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-3 gap-12 items-start">
        <main className="md:col-span-2 space-y-8">
          
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
               <Link 
                  href={courseOutlineUrl}
                  download 
                  target="_blank" 
                  className={cn(buttonVariants({ size: "lg" }), "no-underline")}
                >
                  <DownloadCloud className="mr-2 h-5 w-5" />
                  Download Course Outline
                </Link>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-bold font-heading mb-4">The Course Leader</h2>
            <div className="relative aspect-video mb-6">
                <Image
                    src="https://picsum.photos/seed/course-leader/800/450"
                    alt="GeePaw Hill"
                    fill
                    className="object-cover rounded-lg"
                    data-ai-hint="portrait professional"
                />
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>My name is GeePaw Hill, and I have been helping software development teams to find the path to “better” for just over 25 years. I have worked with over a hundred different teams, in every flavor of software development.</p>
              <p>I have helped dozens of teams adopt – and adapt – new ideas to their particular custom circumstances. And there are always custom circumstances. Now, I am wanting to share what I have learned, in a short, intimate, live, remote course, called “Leading Technical Change” (LTC).</p>
              <p>LTC is composed of 4 2-hour sessions, distributed across a single week. Each offering of the course is limited to just 6 attendees.</p>
              <p>In those 8 hours, LTC develops the theory of change, then offers a variety of hardcore techniques, and finally, case-by-case analysis and advice about the real change-problems facing each attendee.</p>
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
