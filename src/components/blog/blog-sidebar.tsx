
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface BlogSidebarProps {
  tags: string[];
  archives: string[]; // Format: "Month Year" e.g., "January 2024"
}

export function BlogSidebar({ tags, archives }: BlogSidebarProps) {
  const pathname = usePathname();
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
                       href={pathname + '?' + createQueryString('tag', tag)}
                       scroll={false} // Prevent page scroll on filter change
                     >
                       <Badge
                         variant={currentTag === tag ? 'default' : 'secondary'}
                         // Added rounded-md to override default pill shape and py-1 for padding
                         className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md py-1"
                       >
                         {tag}
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

