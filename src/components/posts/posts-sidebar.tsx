
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { EmailSignupForm } from '@/components/email-signup-form';
import { BookOpen } from 'lucide-react'; // Icon for series

interface PostsSidebarProps {
  tags: string[];
  archives: string[]; // Format: "Month Year" e.g., "January 2024"
  series: string[]; // Added series prop
}

function toTitleCase(str: string): string {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function PostsSidebar({ tags, archives, series }: PostsSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');
  const currentArchive = searchParams.get('archive');
  const currentSeries = searchParams.get('series'); // Get current series filter

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    // If clicking the same filter, toggle it off. Otherwise, set it.
    // For series, we only allow one active series filter at a time.
    // If another filter type (tag/archive) is active, preserve it.
    
    const currentFilterValue = params.get(name);

    // Clear other filter types if a new type is selected
    if (name === 'tag' && (params.has('archive') || params.has('series'))) {
        params.delete('archive');
        params.delete('series');
    } else if (name === 'archive' && (params.has('tag') || params.has('series'))) {
        params.delete('tag');
        params.delete('series');
    } else if (name === 'series' && (params.has('tag') || params.has('archive'))) {
        params.delete('tag');
        params.delete('archive');
    }

    if (currentFilterValue === value) {
      params.delete(name); // Toggle off
    } else {
      params.set(name, value); // Set new filter
    }
    return params.toString();
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <Accordion type="multiple" collapsible className="w-full" defaultValue={['tags', 'archives', 'series']}>
          <AccordionItem value="tags">
            <AccordionTrigger className="text-lg font-medium">Tags</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={pathname + '?' + createQueryString('tag', tag)}
                    scroll={false}
                  >
                    <Badge
                      variant={currentTag === tag ? 'default' : 'secondary'}
                      className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md py-1.5 px-3 border border-border"
                    >
                      {toTitleCase(tag)}
                    </Badge>
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="archives">
            <AccordionTrigger className="text-lg font-medium">Archives</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pt-2">
                {archives.map((archive) => (
                  <li key={archive}>
                    <Link
                      href={pathname + '?' + createQueryString('archive', archive)}
                      scroll={false}
                      className={`text-sm hover:text-primary ${currentArchive === archive ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                    >
                      {archive}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {series && series.length > 0 && ( // Conditionally render Series section
            <AccordionItem value="series">
              <AccordionTrigger className="text-lg font-medium">Series</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 pt-2">
                  {series.map((seriesName) => (
                    <li key={seriesName}>
                      <Link
                        href={pathname + '?' + createQueryString('series', seriesName)}
                        scroll={false}
                        className={`flex items-center text-sm hover:text-primary ${currentSeries === seriesName ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                      >
                        <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                        {seriesName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-3">Stay Updated</h3>
          <EmailSignupForm />
        </div>
      </CardContent>
    </Card>
  );
}
