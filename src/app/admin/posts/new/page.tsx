'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Upload, MessageSquare, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { getAllSeries } from '@/services/posts';

const NO_SERIES_VALUE = '__NO_SERIES__';
const authors = [
  { id: '1', name: 'GeePaw Hill' },
  { id: '2', name: 'Admin User' },
];

const formSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  body: z.string().min(10),
  authorId: z.string().min(1),
  publishDate: z.date().optional(),
  publishTime: z.string().optional(),
  excerpt: z.string().optional(),
  featuredImage: z.any().optional(),
  allowComments: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  series: z.string().optional(),
  newSeriesTitle: z.string().optional(),
});
export type NewPostFormData = z.infer<typeof formSchema>;

export default function NewPostPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [isSubmittingPublish, setIsSubmittingPublish] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [existingSeries, setExistingSeries] = useState<string[]>([]);

  useEffect(() => {
    getAllSeries()
      .then(setExistingSeries)
      .catch(() => toast({ title: 'Error', description: 'Could not load series.', variant: 'destructive' }));
  }, [toast]);

  const form = useForm<NewPostFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '', slug: '', body: '', authorId: '',
      publishDate: new Date(), publishTime: '', excerpt: '',
      featuredImage: null, allowComments: true, isFeatured: false,
      series: NO_SERIES_VALUE, newSeriesTitle: '',
    },
  });

  function process(values: NewPostFormData) {
    const data = { ...values } as any;
    if (values.newSeriesTitle?.trim()) data.series = values.newSeriesTitle.trim();
    else if (values.series === NO_SERIES_VALUE) data.series = undefined;
    delete data.newSeriesTitle;
    return data as Omit<NewPostFormData, 'newSeriesTitle'>;
  }

  async function saveDraft(values: NewPostFormData) {
    setIsSubmittingDraft(true);
    await new Promise(r => setTimeout(r, 1000));
    setLastUpdated(new Date());
    toast({ title: 'Draft Saved' });
    setIsSubmittingDraft(false);
  }

  async function publish(values: NewPostFormData) {
    setIsSubmittingPublish(true);
    await new Promise(r => setTimeout(r, 1000));
    setLastUpdated(new Date());
    toast({ title: 'Published' });
    setIsSubmittingPublish(false);
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <Button variant="outline" onClick={() => router.push('/admin/posts')}>Cancel</Button>
      </header>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(publish)} className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Content</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                {/* body, excerpt, image fields... same pattern */}
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Publish</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {lastUpdated && <p>Last updated: {format(lastUpdated, 'PPP p')}</p>}
                <div className="flex space-x-2">
                  <Button type="button" onClick={form.handleSubmit(saveDraft)} disabled={isSubmittingDraft}> 
                    {isSubmittingDraft ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Button type="submit" disabled={isSubmittingPublish}>
                    {isSubmittingPublish ? 'Publishing...' : 'Publish'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {/* slug, author, date, time, series, switches... same pattern */}
              </CardContent>
            </Card>
          </aside>
        </form>
      </FormProvider>
    </div>
  );
}
