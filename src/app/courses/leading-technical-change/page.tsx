
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Image from 'next/image'; // Import Image component

const ltcBodyText = `How can we help our software teams get stronger? Faster? Smarter? Happier? More positive and more productive?

There are lots of ideas about what changes we might desire to make, ranging from process to policy to procedure to skillset. There’s no problem in finding proposed changes. No, the problem is in helping your team to actually make any given change.

Leading Technical Change (LTC), is a course designed to focus on how to make change, not which change to make.

Download the LTC Overview for your team lead or department head today! 👇`;

const ltcParagraphs = ltcBodyText.split('\n\n');

export default function LeadingTechnicalChangePage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16"> {/* Added space-y */}
      {/* Existing Hero Section */}
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

      {/* New Section: What is LTC? */}
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

    </div>
  );
}
