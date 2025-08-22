
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { EmailSignupForm } from '@/components/email-signup-form';
import { BookOpen } from 'lucide-react';

interface PostsSidebarProps {
  tags: string[];
  archives: string[];
  series: string[];
}

function toTitleCase(str: string): string {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function PostsSidebar({ tags, archives, series }: PostsSidebarProps) {
  const searchParams = useSearchParams();
  const currentTags = searchParams.get('tags')?.split(',') || [];
  const currentArchive = searchParams.get('archive');
  const currentSeries = searchParams.get('series');

  const createTagQueryString = (clickedTag: string) => {
    const newTags = new Set(currentTags);
    if (newTags.has(clickedTag)) {
      newTags.delete(clickedTag);
    } else {
      newTags.add(clickedTag);
    }
    const newTagsArray = Array.from(newTags);
    const params = new URLSearchParams();
    if (newTagsArray.length > 0) {
      params.set('tags', newTagsArray.join(','));
    }
    return `/posts?${params.toString()}`;
  };
  
  const createFilterQueryString = (name: 'archive' | 'series', value: string) => {
    const params = new URLSearchParams();
    if ((name === 'archive' && currentArchive === value) || (name === 'series' && currentSeries === value)) {
        // Toggling off, so no parameter is added
    } else {
        params.set(name, value);
    }
    return `/posts?${params.toString()}`;
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <Accordion type="multiple" className="w-full" defaultValue={['series', 'tags', 'archives']}>
          {series && series.length > 0 && (
            <AccordionItem value="series">
              <AccordionTrigger className="text-lg font-medium font-heading">Series</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 pt-2">
                  {series.map((seriesName) => (
                    <li key={seriesName}>
                      <Link
                        href={createFilterQueryString('series', seriesName)}
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

          <AccordionItem value="tags">
            <AccordionTrigger className="text-lg font-medium font-heading">Tags</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={createTagQueryString(tag)}
                    scroll={false}
                  >
                    <Badge
                      variant={currentTags.includes(tag) ? 'default' : 'secondary'}
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
            <AccordionTrigger className="text-lg font-medium font-heading">Archives</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pt-2">
                {archives.map((archive) => (
                  <li key={archive}>
                    <Link
                      href={createFilterQueryString('archive', archive)}
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
        </Accordion>

        <div>
          <h3 className="text-lg font-medium mb-3 font-heading">Stay Updated</h3>
          <EmailSignupForm />
        </div>
      </CardContent>
    </Card>
  );
}
