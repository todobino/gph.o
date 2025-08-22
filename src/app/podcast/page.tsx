
import { ContactForm } from '@/components/contact-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Podcast, Rss } from 'lucide-react';
import Link from 'next/link';

const podcastLinks = [
  { name: 'RSS', url: 'https://anchor.fm/s/f6a6558/podcast/rss', icon: <Rss className="w-5 h-5 mr-2" /> },
  { name: 'Spotify', url: 'https://open.spotify.com/show/6rte6liF1WtEW3Pxrr2E9y', icon: <Podcast className="w-5 h-5 mr-2" /> },
  { name: 'Google Podcasts', url: 'https://www.google.com/podcasts?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy9mNmE2NTU4L3BvZGNhc3QvcnNz', icon: <Podcast className="w-5 h-5 mr-2" /> },
  { name: 'Breaker', url: 'https://www.breaker.audio/geepawhill', icon: <Podcast className="w-5 h-5 mr-2" /> },
  { name: 'Overcast', url: 'https://overcast.fm/itunes1484418432/geepawhill', icon: <Podcast className="w-5 h-5 mr-2" /> },
  { name: 'Pocket Casts', url: 'https://pca.st/z1vmeibv', icon: <Podcast className="w-5 h-5 mr-2" /> },
  { name: 'RadioPublic', url: 'https://radiopublic.com/geepawhill-WkX0Yx', icon: <Podcast className="w-5 h-5 mr-2" /> },
  { name: 'Amazon Music', url: 'https://music.amazon.com/podcasts/e8acfea9-b9c6-4fa3-84dc-99e75b712afa', icon: <Podcast className="w-5 h-5 mr-2" /> },
];

export default function PodcastPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-12">
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

            {/* Podcast Subscription Links */}
            <section className="space-y-6">
              <h2 className="text-3xl font-semibold text-center font-heading">Subscribe to the Podcast</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {podcastLinks.map((link) => (
                  <Link key={link.name} href={link.url} passHref legacyBehavior>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block transition-transform transform hover:scale-105"
                    >
                      <Card className="hover:bg-accent hover:text-accent-foreground cursor-pointer h-full">
                        <CardContent className="p-4 flex items-center justify-center text-center">
                          {link.icon}
                          <span className="font-medium">{link.name}</span>
                        </CardContent>
                      </Card>
                    </a>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Sponsorship Section */}
            <Card className="bg-secondary/50 sticky top-24">
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
      </div>
    </div>
  );
}
