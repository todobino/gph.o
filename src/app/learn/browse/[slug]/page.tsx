


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

          <Separator />

          <section>
            <h2 className="text-2xl font-bold font-heading mb-4">Theory of Change</h2>
            <div className="relative aspect-video mb-6">
              <Image
                src="https://picsum.photos/seed/theory-change/800/450"
                alt="Abstract image representing theory of change"
                fill
                className="object-cover rounded-lg"
                data-ai-hint="abstract theory"
              />
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>Many people, conceiving of some change they want to make, focus all of their attention only on the “what” of that particular change. But successful change, <em>any</em> successful change, depends at least as much on the “how” as on the “what”.</p>
                <p>The theory of change we’ll be working with in the course is based around research on “cognitive frames”, the short-hand pre-assembled bits and pieces that actually underlie most day-to-day action. We can’t eliminate frames (and we wouldn’t want to), we can only change their shape.</p>
                <p>Doing that involves three abstract strategies:</p>
                <p>Take many more much smaller steps (MMMSS). Optimize for the humans (OFTH). Make Change Normal (MCN). From these three broad strategies, we can develop specific, powerful tactics to increase the likelihood that our changes will really work, and really stick.</p>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-bold font-heading mb-4">Technique of Change</h2>
             <div className="relative aspect-video mb-6">
              <Image
                src="https://picsum.photos/seed/technique-change/800/450"
                alt="Image representing different techniques"
                fill
                className="object-cover rounded-lg"
                data-ai-hint="tools techniques"
              />
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>The course comes with what we call the Techniques Bundle. This is a collection of actual practical tips and tricks. Some of these will be familiar, some new, but all will make more sense when interpreted within the theory above. Each technique is a headline and a one-page description. Here are five of the headlines, chosen at random.</p>
                
                <p><strong>Easiest Nearest Owwie First:</strong> There are small problems and there are big ones. Fix the small ones before you approach the big ones.</p>

                <p><strong>Create Experiences, Not Arguments:</strong> Actual lived experience is the most powerful persuasive force there is.</p>

                <p><strong>Use Locally Grounded Lightning Talks:</strong> Short high-speed talks, 15 minutes at a time, based in the real day-job situations, stir conversation, spread experience, and build both community & consensus.</p>

                <p><strong>Dot Votes Are Data:</strong> You can gather and objectify real information for your team using even very simple and lightweight approaches. It’s cheaper, faster, and every bit as objective.</p>

                <p><strong>Get A Heavyweight To Bless An Activity:</strong> Everyone in the c-suite knows what it is to “bless” an experiment, or a learning session. Ask them to spend 5 minutes telling the team they approve of yours.</p>

                <p>There are currently more than 30 techniques in the bundle, and we add new ones all the time, based partly on what comes from the final element of our structure, the advice.</p>
            </div>
          </section>
          
          <Separator />

          <section>
            <h2 className="text-2xl font-bold font-heading mb-4">Practice of Change</h2>
             <div className="relative aspect-video mb-6">
              <Image
                src="https://picsum.photos/seed/practice-change/800/450"
                alt="People putting theory into practice"
                fill
                className="object-cover rounded-lg"
                data-ai-hint="team practice"
              />
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>Just as all of us are simultaneously alike in some ways and different in others, so, too, with change problems: They’re all alike. And they’re all different.</p>
              <p>The course is restricted to just six attendees for each offering, and there’s a reason for that: it gives us the chance to work not just with theory or memorizing a catalog of practices, but with applying what we’ve learned to the actual change situations that are confronting us right now.</p>
              <p>Over the four days, each of the six attendees will lay out their change case for us. What they want, what they’ve tried, what they’re thinking of trying. We’ll pitch in, a team of seven, to help add to and elaborate on the next few steps towards that change.</p>
              <p>Many of the former students have said this was the most valuable part of the experience: actual interaction with others, to lend ideas, support, and energy to go back to work newly excited and invigorated.</p>
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

       <section className="mt-12 rounded-lg bg-primary-dark text-primary-dark-foreground py-16">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Ready to Convince Your Team?</h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-primary-dark-foreground/80 mb-8">
              Download the complete overview of the Leading Technical Change course to share with your manager or team lead.
            </p>
            <Link 
              href={courseOutlineUrl}
              download 
              target="_blank" 
              className={cn(buttonVariants({ size: "lg", variant: "secondary" }))}
            >
              <DownloadCloud className="mr-2 h-5 w-5" />
              Download Course Outline
            </Link>
        </div>
      </section>

    </div>
  );
}
