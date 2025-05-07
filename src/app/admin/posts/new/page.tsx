
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { getAllSeries } from '@/services/posts'; // Import getAllSeries

// Define a constant for the "No Series" value
const NO_SERIES_VALUE = "__NO_SERIES__";

// Placeholder: Define potential authors
const authors = [
  { id: '1', name: 'GeePaw Hill' },
  { id: '2', name: 'Admin User' },
];

// Define the form schema using Zod
const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  slug: z.string().optional(), // Optional, can be auto-generated
  body: z.string().min(10, { // Placeholder for rich text editor content
    message: 'Post body must be at least 10 characters.',
  }),
  authorId: z.string().min(1, { message: 'Please select an author.' }),
  publishDate: z.date().optional(),
  publishTime: z.string().optional(), // Placeholder for time HH:MM
  excerpt: z.string().optional(),
  featuredImage: z.any().optional(), // Placeholder for file upload
  allowComments: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  series: z.string().optional(), // Existing series selection (can be NO_SERIES_VALUE)
  newSeriesTitle: z.string().optional(), // For creating a new series
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
    async function fetchSeries() {
      try {
        const series = await getAllSeries();
        setExistingSeries(series);
      } catch (error) {
        console.error("Failed to fetch series:", error);
        toast({
          title: "Error",
          description: "Could not load existing series.",
          variant: "destructive",
        });
      }
    }
    fetchSeries();
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
      allowComments: true,
      isFeatured: false,
      series: NO_SERIES_VALUE, // Default to "No Series" value
      newSeriesTitle: '',
    },
  });

  function processFormValues(values: NewPostFormData): Omit<NewPostFormData, 'newSeriesTitle'> {
    const finalValues: any = { ...values }; // Use any temporarily

    // If a new series title is provided, it takes precedence
    if (values.newSeriesTitle && values.newSeriesTitle.trim() !== '') {
      finalValues.series = values.newSeriesTitle.trim();
    } else if (values.series === NO_SERIES_VALUE) {
       // If the selected value is the placeholder for "No Series", set series to undefined
       finalValues.series = undefined;
    }

    delete finalValues.newSeriesTitle; // Don't send newSeriesTitle to backend

    // Explicitly type the return value
    return finalValues as Omit<NewPostFormData, 'newSeriesTitle'>;
  }

  async function onSaveDraft(values: NewPostFormData) {
    setIsSubmittingDraft(true);
    const processedValues = processFormValues(values);
    console.log('Saving Draft (Placeholder):', processedValues);
    // TODO: Implement actual save draft logic with Firestore using processedValues
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    toast({
      title: 'Draft Saved',
      description: 'Your post has been saved as a draft (Placeholder).',
    });
    setIsSubmittingDraft(false);
  }

  async function onPublish(values: NewPostFormData) {
    setIsSubmittingPublish(true);
    const processedValues = processFormValues(values);
    console.log('Publishing Post (Placeholder):', processedValues);
     // TODO: Implement actual publish logic with Firestore using processedValues
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    toast({
      title: 'Post Published',
      description: 'Your post has been published (Placeholder).',
    });
    setIsSubmittingPublish(false);
  }

  const onSubmit = (values: NewPostFormData) => {
    // This function might not be strictly needed if using separate save/publish handlers
    console.log('Form submitted with values (should trigger save/publish):', values);
  };

  const handleSaveDraftClick = () => {
    form.handleSubmit(onSaveDraft)();
  };

  const handlePublishClick = () => {
    form.handleSubmit(onPublish)();
  };

  const handleCancelClick = () => {
    // TODO: Implement logic to potentially delete the draft if it exists
    console.log("Deleting draft (Placeholder) and navigating back to admin posts.");
    router.push('/admin/posts'); // Navigate back to the posts list
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold">Create New Post</h1>
        <Button variant="outline" onClick={handleCancelClick}>Cancel</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                          placeholder="Write your post content here... (Rich Text Editor placeholder)"
                          className="min-h-[300px] resize-y"
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
                          placeholder="Optional: Write a short summary..."
                          className="resize-y"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief summary shown in post listings.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image</FormLabel>
                       <div className="border border-dashed border-muted-foreground rounded-md p-6 text-center">
                          <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Image upload coming soon.</p>
                          <Button variant="outline" size="sm" className="mt-4" disabled>
                            Upload Image
                          </Button>
                        </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

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
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-between">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraftClick}
                    disabled={isSubmittingDraft || isSubmittingPublish}
                    className="flex-1"
                  >
                    {isSubmittingDraft ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Button
                    onClick={handlePublishClick}
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an author" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publishDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Publish Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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
                <FormItem>
                  <FormLabel>Publish Time (Optional)</FormLabel>
                  <FormControl>
                    <Input type="time" placeholder="HH:MM" disabled />
                  </FormControl>
                </FormItem>

                <FormField
                  control={form.control}
                  name="series"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Series</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value === null ? NO_SERIES_VALUE : field.value}
                        defaultValue={NO_SERIES_VALUE}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an existing series" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={NO_SERIES_VALUE}>No Series</SelectItem>
                          {existingSeries.map((seriesName) => (
                            <SelectItem key={seriesName} value={seriesName}>
                              {seriesName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Input placeholder="Enter title for a new series" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allowComments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <FormLabel className="text-sm font-normal">
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                       <div className="flex items-center gap-2">
                         <Star className="h-5 w-5 text-muted-foreground" />
                         <FormLabel className="text-sm font-normal">
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
      </Form>
    </div>
  );
}

