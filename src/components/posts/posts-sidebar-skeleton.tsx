
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function PostsSidebarSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <Accordion type="multiple" className="w-full" defaultValue={['series', 'tags', 'archives']}>
          {/* Series Skeleton */}
          <AccordionItem value="series">
            <AccordionTrigger className="text-lg font-medium font-heading">
              <Skeleton className="h-6 w-20" />
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Tags Skeleton */}
          <AccordionItem value="tags">
            <AccordionTrigger className="text-lg font-medium font-heading">
              <Skeleton className="h-6 w-16" />
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-2">
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Archives Skeleton */}
          <AccordionItem value="archives">
            <AccordionTrigger className="text-lg font-medium font-heading">
              <Skeleton className="h-6 w-24" />
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pt-2">
                <li><Skeleton className="h-5 w-full" /></li>
                <li><Skeleton className="h-5 w-full" /></li>
                <li><Skeleton className="h-5 w-full" /></li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Email Signup Skeleton */}
        <div>
          <Skeleton className="h-6 w-32 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
