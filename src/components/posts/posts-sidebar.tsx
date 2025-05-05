
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PostsSidebarProps { // Renamed interface
  tags: string[];
  archives: string[]; // Format: "Month Year" e.g., "January 2024"
}

// Helper function to convert string to Title Case
function toTitleCase(str: string): string {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}


export function PostsSidebar({ tags, archives }: PostsSidebarProps) { // Renamed component and props interface
  const pathname = usePathname(); // Should be /posts now
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');
  const currentArchive = searchParams.get('archive');

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(name) === value) {
      params.delete(name); // Toggle off if clicking the same filter
    } else {
      params.set(name, value);
    }
    return params.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="multiple" collapsible className="w-full" defaultValue={['tags', 'archives']}>
           <AccordionItem value="tags">
             <AccordionTrigger className="text-lg font-medium">Tags</AccordionTrigger>
             <AccordionContent>
               <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag) => (
                     <Link
                       key={tag}
                       href={pathname + '?' + createQueryString('tag', tag)} // Pathname will be /posts
                       scroll={false} // Prevent page scroll on filter change
                     >
                       <Badge
                         variant={currentTag === tag ? 'default' : 'secondary'}
                         className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md py-1"
                       >
                         {toTitleCase(tag)} {/* Apply Title Case here */}
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
                      href={pathname + '?' + createQueryString('archive', archive)} // Pathname will be /posts
                       scroll={false} // Prevent page scroll on filter change
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
      </CardContent>
    </Card>
  );
}

