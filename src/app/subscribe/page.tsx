
import { EmailSignupForm } from '@/components/email-signup-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Rss, Podcast } from 'lucide-react'; // Using generic Podcast icon

// Placeholder URLs - Replace with actual links
const podcastLinks = [
  { name: 'RSS', url: '#', icon: <Rss className="w-5 h-5 mr-2" /> },
  { name: 'Spotify', url: '#', icon: <Podcast className="w-5 h-5 mr-2" /> }, // Placeholder icon
  { name: 'Apple Podcasts', url: '#', icon: <Podcast className="w-5 h-5 mr-2" /> }, // Placeholder icon
  { name: 'Google Podcasts', url: '#', icon: <Podcast className="w-5 h-5 mr-2" /> }, // Placeholder icon
  { name: 'Breaker', url: '#', icon: <Podcast className="w-5 h-5 mr-2" /> }, // Placeholder icon
  { name: 'Overcast', url: '#', icon: <Podcast className="w-5 h-5 mr-2" /> }, // Placeholder icon
  { name: 'Pocket Casts', url: '#', icon: <Podcast className="w-5 h-5 mr-2" /> }, // Placeholder icon
  { name: 'RadioPublic', url: '#', icon: <Podcast className="w-5 h-5 mr-2" /> }, // Placeholder icon
  { name: 'Amazon Music', url: '#', icon: <Podcast className="w-5 h-5 mr-2" /> }, // Placeholder icon
];

export default function SubscribePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8">Subscribe</h1>

      {/* Email Signup Section */}
      <section className="bg-muted p-8 rounded-lg shadow-sm">
        <h2 className="text-3xl font-semibold text-center mb-6">Sign Up for Email Updates</h2>
        <p className="text-center text-muted-foreground mb-8">
          Get notified about new posts, videos, and upcoming events.
        </p>
        <div className="max-w-md mx-auto">
          <EmailSignupForm />
        </div>
      </section>

      {/* Podcast Subscription Section */}
      <section>
        <h2 className="text-3xl font-semibold text-center mb-8">Subscribe to the Podcast</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <p className="text-xs text-center text-muted-foreground mt-4">
            (Podcast links are placeholders)
        </p>
      </section>
    </div>
  );
}
