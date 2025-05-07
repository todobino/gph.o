'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Upload, MessageSquare, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
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
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  slug: z.string().optional(),
  body: z.string().min(10, { message: 'Post body must be at least 10 characters.' }),
  authorId: z.string().min(1, { message: 'Please select an author.' }),
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
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Could not load existing series.',
          variant: 'destructive',
        })
      );
  }, [toast]);

  const form = useForm<NewPostFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      body: '',
      authorId: '',
      publishDate: new Date(),
      publishTime: '',
      excerpt: '',
      featuredImage: null,
      allowComments: true,
      isFeatured: false,
      series: NO_SERIES_VALUE,
      newSeriesTitle: '',
    },
  });

  function processFormValues(values: NewPostFormData) {
    const data: any = { ...values };
    if (values.newSeriesTitle?.trim()) {
      data.series = values.newSeriesTitle.trim();
    } else if (values.series === NO_SERIES_VALUE) {
      data.series = undefined;
    }
    delete data.newSeriesTitle;
    return data as Omit<NewPostFormData, 'newSeriesTitle'>;
  }

  async function onSaveDraft(values: NewPostFormData) {
    setIsSubmittingDraft(true);
    const payload = processFormValues(values);
    console.log('Saving Draft:', payload);
    await new Promise((r) => setTimeout(r, 1000));
    setLastUpdated(new Date());
    toast({ title: 'Draft Saved', description: 'Your draft has been saved.' });
    setIsSubmittingDraft(false);
  }

  async function onPublish(values: NewPostFormData) {
    setIsSubmittingPublish(true);
    const payload = processFormValues(values);
    console.log('Publishing Post:', payload);
    await new Promise((r) => setTimeout(r, 1000));
    setLastUpdated(new Date());
    toast({ title: 'Post Published', description: 'Your post is live!' });
    setIsSubmittingPublish(false);
  }

  const handleCancel = () => router.push('/admin/posts');

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold">Create New Post</h1>
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
      </div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onPublish)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[300px] resize-y"
                          placeholder="Write your post content here..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          className="resize-y"
                          placeholder="Optional summary..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief summary shown in listings.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={() => (
                    <FormItem>
                      <FormLabel>Featured Image</FormLabel>
                      <div className="border border-dashed border-input rounded-md p-6 text-center">
                        <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Image upload coming soon.
                        </p>
                        <Button variant="outline" size="sm" disabled>
                          Upload Image
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lastUpdated && (
                  <p className="text-sm text-muted-foreground">
                    Last Updated: {format(lastUpdated, 'PPP p')}
                  </p>
                )}
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={form.handleSubmit(onSaveDraft)}
                    disabled={isSubmittingDraft || isSubmittingPublish}
                    className="flex-1"
                  >
                    {isSubmittingDraft ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingDraft || isSubmittingPublish}
                    className="flex-1"
                  >
                    {isSubmittingPublish ? 'Publishing...' : 'Publish'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="post-title-slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="authorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an author" />
                          </SelectTrigger>
                          <SelectContent>
                            {authors.map((a) => (
                              <SelectItem key={a.id} value={a.id}>
                                {a.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publishDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publish Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publishTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publish Time (Optional)</FormLabel>
                      <FormControl>
                        <Input type="time" placeholder="HH:MM" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="series"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Series</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={
                            field.value ?? NO_SERIES_VALUE
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a series" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={NO_SERIES_VALUE}>
                              No Series
                            </SelectItem>
                            {existingSeries.map((name) => (
                              <SelectItem key={name} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newSeriesTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Or Create New Series</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter series title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="allowComments"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <FormLabel className="m-0 text-sm font-normal">
                          Allow Comments
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        <FormLabel className="m-0 text-sm font-normal">
                          Featured Post
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
