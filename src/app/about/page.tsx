import Image from 'next/image';

const bodyText = `I was lucky enough to become a professional computer programmer around the middle of 1980. I wrote in a language we hardly see anymore, called Forth. I wrote a word processor, a database system, a pen-plotter system, and a whole bunch of unique extensions to the Forth language. I have been an independent for most of my 40-year career.

About 20 years ago, I became an avid early-adopter of a programming method called Extreme Programming (XP). I fell deeply under the influence of ne’er-do-wells like Kent Beck, Ron Jeffries, Bob Martin, and joined that early movement with great energy and fervor.

I also became a software development coach.

I work with software organizations all over the world, down on the floor and up in the penthouse, helping them find and implement solutions to the vexing difficulties of shipping software value for a living.

I live in an aging hippie community in central Virginia, nestled up in the foothills of the gorgeous Blue Ridge mountains, half an hour’s drive from Charlottesville. I live with my glorious wife Virginia, two dogs called Molly and Wally, and various parts at various times of the rest of my awesome family.

Your organization can work with GeePaw.

Your conference or user’s group can meet GeePaw.

1Yes, it’s really GeePaw, which is short for ‘grandfather’. Through a series of miraculous events, I became a grandfather at a very young age, just 31. Family and friends thought it was funny, and started calling me GeePaw. The GeeKids in question all grew up calling me that. Now, 27 years on, folks mostly just call me GeePaw. If that makes you uncomfortable, my given name is Michael, and you’re welcome to use that, too.`;

// Split the text into paragraphs based on double newlines
const paragraphs = bodyText.split('\n\n');

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: Text Content */}
        <div className="w-full lg:w-2/3 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight font-heading">Hi! I’m GeePaw<sup>1</sup> Hill.</h1>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-lg text-foreground/80 leading-relaxed">
              {/* Handle the superscript in the last paragraph */}
              {index === paragraphs.length - 1 ? (
                <>
                  <sup>1</sup>{paragraph.substring(1)} {/* Display '1' as superscript and rest of paragraph */}
                </>
              ) : (
                paragraph
              )}
            </p>
          ))}
        </div>

        {/* Right Column: Images */}
        <div className="w-full lg:w-1/3">
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://picsum.photos/seed/about1/300/300"
              alt="Placeholder image 1"
              width={300}
              height={300}
              className="rounded-lg shadow-md object-cover aspect-square"
              data-ai-hint="professional portrait"
            />
            <Image
              src="https://picsum.photos/seed/about2/300/300"
              alt="Placeholder image 2"
              width={300}
              height={300}
              className="rounded-lg shadow-md object-cover aspect-square"
               data-ai-hint="speaking conference"
            />
            <Image
              src="https://picsum.photos/seed/about3/300/300"
              alt="Placeholder image 3"
              width={300}
              height={300}
              className="rounded-lg shadow-md object-cover aspect-square"
               data-ai-hint="working team"
            />
            <Image
              src="https://picsum.photos/seed/about4/300/300"
              alt="Placeholder image 4"
              width={300}
              height={300}
              className="rounded-lg shadow-md object-cover aspect-square"
               data-ai-hint="casual candid"
            />
          </div>
        </div>
      </div>
    </div>
  );
}