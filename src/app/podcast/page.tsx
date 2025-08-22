
import { ContactForm } from '@/components/contact-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Podcast } from 'lucide-react';
import Link from 'next/link';

export default function PodcastPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <Podcast className="mx-auto h-16 w-16 text-primary" />
          <h1 className="text-4xl font-bold font-heading">The PawCast</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join GeePaw Hill for his regular musings on software development, team dynamics, and the life of a geek. It's the audio-form of the blog you love, perfect for your commute or while you code.
          </p>
          <Button asChild size="lg">
            <Link href="https://podcasts.apple.com/us/podcast/pawcast-with-geepaw-hill/id1484418432" target="_blank" rel="noopener noreferrer">
              Listen on Apple Podcasts
            </Link>
          </Button>
        </div>

        {/* Sponsorship Section */}
        <Card className="bg-secondary/50">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold font-heading">Sponsor the Podcast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-center text-muted-foreground max-w-2xl mx-auto">
                    Interested in reaching a dedicated audience of software developers, coaches, and leaders? Sponsoring the PawCast is a great way to connect with engaged listeners. Fill out the form below to start the conversation.
                </p>
                <div className="max-w-xl mx-auto">
                    <ContactForm />
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
