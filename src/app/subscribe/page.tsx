
import { EmailSignupForm } from '@/components/email-signup-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, Rss, Podcast } from 'lucide-react'; // Using generic Podcast icon
import Link from 'next/link';

// Updated URLs with provided links
const podcastLinks = [
  { name: 'RSS', url: 'https://anchor.fm/s/f6a6558/podcast/rss', icon: <Rss className="w-5 h-5 mr-2" /> },
  { name: 'Spotify', url: 'https://open.spotify.com/show/6rte6liF1WtEW3Pxrr2E9y', icon: <Podcast className="w-5 h-5 mr-2" /> },
  { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/us/podcast/geepawhill/id1484418432?uo=4', icon: <Podcast className="w-5 h-5 mr-2" /> },
  { name: 'Google Podcasts', url: 'https://www.google.com/podcasts?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy9mNmE2NTU4L3BvZGNhc3QvcnNz', icon: <Podcast className="w-5 h-5 mr-2" /> },
  { name: 'Breaker', url: 'https://www.breaker.audio/geepawhill', icon: <Podcast className="w-5 h-5 mr-2" /> },
  { name: 'Overcast', url: 'https://overcast.fm/itunes1484418432/geepawhill', icon: <Podcast className="w-5 h-5 mr-2" /> },
  { name: 'Pocket Casts', url: 'https://pca.st/z1vmeibv', icon: <Podcast className="w-5 h-5 mr-2" /> },
  { name: 'RadioPublic', url: 'https://radiopublic.com/geepawhill-WkX0Yx', icon: <Podcast className="w-5 h-5 mr-2" /> },
  { name: 'Amazon Music', url: 'https://music.amazon.com/podcasts/e8acfea9-b9c6-4fa3-84dc-99e75b712afa', icon: <Podcast className="w-5 h-5 mr-2" /> },
];

export default function SubscribePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Email Signup */}
        <section className="space-y-6 bg-secondary p-8 rounded-lg">
          <h2 className="text-3xl font-semibold text-center font-heading">Sign Up for Email Updates</h2>
          <p className="text-center text-muted-foreground">
            Get notified about new posts, videos, and upcoming events.
          </p>
          <div className="max-w-md mx-auto">
            <EmailSignupForm />
          </div>
        </section>

        {/* Right Column: Podcast Subscription */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center font-heading">Subscribe to the Podcast</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {podcastLinks.map((link) => (
              <Link key={link.name} href={link.url} passHref legacyBehavior>
                <a
                  target="_blank" // Open in new tab
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
    </div>
  );
}
