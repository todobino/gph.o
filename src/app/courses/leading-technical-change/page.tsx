
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Image from 'next/image'; // Import Image component

const ltcBodyText = `How can we help our software teams get stronger? Faster? Smarter? Happier? More positive and more productive?

There are lots of ideas about what changes we might desire to make, ranging from process to policy to procedure to skillset. There’s no problem in finding proposed changes. No, the problem is in helping your team to actually make any given change.

Leading Technical Change (LTC), is a course designed to focus on how to make change, not which change to make.

Download the LTC Overview for your team lead or department head today! 👇`;

const courseLeaderBodyText = `My name is GeePaw Hill, and I have been helping software development teams to find the path to “better” for just over 25 years. I have worked with over a hundred different teams, in every flavor of software development.

I have helped dozens of teams adopt – and adapt – new ideas to their particular custom circumstances. And there are always custom circumstances. Now, I am wanting to share what I have learned, in a short, intimate, live, remote course, called “Leading Technical Change” (LTC).

LTC is composed of 4 2-hour sessions, distributed across a single week. Each offering of the course is limited to just 6 attendees.

In those 8 hours, LTC develops the theory of change, then offers a variety of hardcore techniques, and finally, case-by-case analysis and advice about the real change-problems facing each attendee.`;

const theoryOfChangeBodyText = `Many people, conceiving of some change they want to make, focus all of their attention only on the “what” of that particular change.  But successful change, *any* successful change, depends at least as much on the “how” as on the “what”.

The  theory of change we’ll be working with in the course is based around research on “cognitive frames”, the short-hand pre-assembled bits and pieces that actually underlie most day-to-day action. We can’t eliminate frames (and we wouldn’t want to), we can only change their shape.

Doing that involves three abstract strategies:

Take many more much smaller steps (MMMSS).
Optimize for the humans (OFTH).
Make Change Normal (MCN).
From these three broad strategies, we can develop specific, powerful tactics to increase the likelihood that our changes will really work, and really stick.`;


const ltcParagraphs = ltcBodyText.split('\n\n');
const courseLeaderParagraphs = courseLeaderBodyText.split('\n\n');
const theoryOfChangeParagraphs = theoryOfChangeBodyText.split('\n\n');

export default function LeadingTechnicalChangePage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16"> {/* Added space-y */}
      {/* Hero Section */}
      <div className="bg-secondary p-8 md:p-12 rounded-lg shadow-sm text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Leading Technical Change
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-4">
          No upcoming LTC classes at this time. Be on the lookout for announcements of the next live cohort.
        </p>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Learn more about the course and download the outline below!
        </p>
         {/* Placeholder button for downloading outline */}
         <Button size="lg" disabled> {/* Disabled until functionality is added */}
             <Download className="mr-2 h-5 w-5" />
             Download Course Outline (Coming Soon)
         </Button>
      </div>

      {/* Section 1: What is LTC? */}
      <section className="flex flex-col md:flex-row gap-12 items-start">
        {/* Left Column: Text Content */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-3xl font-semibold mb-4">
            What is LTC? - “Better.”
          </h2>
          {ltcParagraphs.map((paragraph, index) => (
            <p key={index} className="text-lg text-foreground/80 leading-relaxed">
              {paragraph}
            </p>
          ))}
          {/* Download button again */}
          <Button size="lg" disabled className="mt-4"> {/* Added margin-top */}
            <Download className="mr-2 h-5 w-5" />
            Download Course Outline (Coming Soon)
          </Button>
        </div>

        {/* Right Column: Image */}
        <div className="w-full md:w-1/2">
           <Image
               src="https://picsum.photos/seed/ltc-section1/800/450" // 16:9 aspect ratio
               alt="Placeholder image representing technical change concepts"
               width={800}
               height={450}
               className="rounded-lg shadow-md object-cover w-full h-auto"
               data-ai-hint="team collaboration diagram"
           />
        </div>
      </section>

       {/* Section 2: The Course Leader */}
       <section className="flex flex-col md:flex-row-reverse gap-12 items-start"> {/* Reversed order for image on left */}
         {/* Right Column: Text Content */}
         <div className="w-full md:w-1/2 space-y-6">
           <h2 className="text-3xl font-semibold mb-4">
             The Course Leader
           </h2>
           {courseLeaderParagraphs.map((paragraph, index) => (
             <p key={index} className="text-lg text-foreground/80 leading-relaxed">
               {paragraph}
             </p>
           ))}
         </div>

         {/* Left Column: Image */}
         <div className="w-full md:w-1/2">
            <Image
                src="https://picsum.photos/seed/ltc-section2/800/450" // 16:9 aspect ratio
                alt="Placeholder image representing the course leader or teaching"
                width={800}
                height={450}
                className="rounded-lg shadow-md object-cover w-full h-auto"
                data-ai-hint="speaker teaching presentation"
            />
         </div>
       </section>

       {/* New Section 3: Theory of Change */}
        <section className="flex flex-col md:flex-row gap-12 items-start">
          {/* Left Column: Text Content */}
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl font-semibold mb-4">
              Theory of Change
            </h2>
            {theoryOfChangeParagraphs.map((paragraph, index) => (
              <p key={index} className="text-lg text-foreground/80 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Right Column: Two Images */}
          <div className="w-full md:w-1/2 space-y-4">
            <Image
                src="https://picsum.photos/seed/ltc-section3-1/800/450" // 16:9 aspect ratio
                alt="Placeholder image related to cognitive frames or change strategies"
                width={800}
                height={450}
                className="rounded-lg shadow-md object-cover w-full h-auto"
                data-ai-hint="abstract mind diagram"
            />
            <Image
                src="https://picsum.photos/seed/ltc-section3-2/800/450" // 16:9 aspect ratio
                alt="Another placeholder image related to change management concepts"
                width={800}
                height={450}
                className="rounded-lg shadow-md object-cover w-full h-auto"
                data-ai-hint="steps progress illustration"
            />
          </div>
        </section>

    </div>
  );
}
