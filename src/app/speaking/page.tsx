
import { ContactForm } from '@/components/contact-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2 } from 'lucide-react';
import Link from 'next/link';

const speakingText = `I regularly give talks at conferences and user groups around the world. It is one of my favorite activities. I believe in this movement, and I want it to spread as far and wide as possible. In my talks, I combine practical insights with wry humor, and I am well-known on the conference circuit as an entertaining and educational speaker.

Whether it’s for 10 people in a user group, or 500 at a major conference, I am interested in getting the chance to discuss ideas. I do not have a firm speaker fee, but instead work with organizers to find the way to make it happen.

If you’re interested in a session, it starts with you inviting me. Just drop me an email here and we can start the conversation today!`;

const paragraphs = speakingText.split('\n\n');

const featuredKeynotes = [
    { name: 'Agile & Beyond', href: 'https://twitter.com/agileandbeyond' },
    { name: 'deliver:Agile', href: 'https://twitter.com/AgileAlliance' },
    { name: 'Beauty in Code', href: 'https://beautyincode.se/' },
];

export default function SpeakingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column: Text and Keynotes */}
            <div className="space-y-6">
                <h1 className="text-4xl font-bold font-heading">Speaking Events</h1>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-heading">Featured Keynotes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {featuredKeynotes.map(keynote => (
                                <li key={keynote.name}>
                                    <Link href={keynote.href} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                                        <Link2 className="h-4 w-4 mr-2" />
                                        <span>{keynote.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 leading-relaxed">
                    {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                </div>
            </div>
            {/* Right Column: Video and Contact Form */}
            <div className="space-y-8">
                 {/* Video Embed Section */}
                 <div className="aspect-video">
                    <iframe
                        className="w-full h-full rounded-lg shadow-md"
                        src="https://www.youtube.com/embed/lNpof6rRB9U?autoplay=1&mute=1&start=325"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                {/* Contact Form Section */}
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold font-heading">Inquire About Speaking</h2>
                  <ContactForm />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
