
import { ContactForm } from '@/components/contact-form';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';
import Link from 'next/link';

const coachingText = `I am a full-time professional software development coach available to help your team. I work with a large variety of organizations, from the local non-profit with 2 developers to the gigantic Fortune 500 company with 2,000. I am a geek’s geek, and am perfectly comfortable working directly with programmers. At the same time, I can often deliver tremendous value in the executive suite, as I am strong at organization, planning, and direct conversation. I have shipped software of every kind and in most of the modern programming environments.

I do not install a branded agile method, although I am conversant and comfortable with all of them. Instead, my focus is helping folks make sticky improvements to whatever their current techniques are. It does not matter what you are doing now. What matters is we find & implement better whenever we choose to.

I work all over the world, in chunks as small as a day or two, and as large as six months at a time. My rates are affected by the duration of the engagement, the size of the group I will be working with, and the extent of my belief that the engagement will do some good for you and me both.

I would like to help.

If you think I might be able to help, please reach out by email right away. My schedule is variable, and there are times when I’m idle, and other times when I’m overbooked. The sooner we start this conversation, the sooner we can establish whether we have a good fit.`;

const paragraphs = coachingText.split('\n\n');

export default function CoachingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Column: Text Content */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight font-heading">30 Years of Coaching</h1>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-lg text-foreground/80 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Right Column: Contact Form */}
        <div className="space-y-6">
           <div className="sticky top-24 space-y-8">
                <div className="p-6 rounded-lg bg-accent text-center">
                    <h3 className="text-2xl font-bold font-heading mb-4 text-accent-foreground">Ready to start?</h3>
                    <Button asChild size="lg">
                        <Link href="/booking">
                            <CalendarPlus className="mr-2 h-5 w-5" />
                            Book 1:1
                        </Link>
                    </Button>
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-heading mb-4">Group Coaching Inquiries</h2>
                    <ContactForm />
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}
