
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Upload, MessageSquare, Star } from 'lucide-react'; // Removed ArrowLeft

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

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
});

export type NewPostFormData = z.infer<typeof formSchema>;

export default function NewPostPage() {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [isSubmittingPublish, setIsSubmittingPublish] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null); // Placeholder state

  // Define the form
  const form = useForm<NewPostFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      body: '',
      authorId: '',
      publishDate: new Date(), // Default to today
      publishTime: '', // Default to empty
      excerpt: '',
      allowComments: true,
      isFeatured: false,
    },
  });

  // Placeholder submit handler for saving as draft
  async function onSaveDraft(values: NewPostFormData) {
    setIsSubmittingDraft(true);
    console.log('Saving Draft (Placeholder):', values);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date()); // Update placeholder last updated time
    toast({
      title: 'Draft Saved',
      description: 'Your post has been saved as a draft (Placeholder).',
    });
    setIsSubmittingDraft(false);
    // TODO: Implement actual API call to save draft
  }

  // Placeholder submit handler for publishing
  async function onPublish(values: NewPostFormData) {
    setIsSubmittingPublish(true);
    console.log('Publishing Post (Placeholder):', values);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date()); // Update placeholder last updated time
    toast({
      title: 'Post Published',
      description: 'Your post has been published (Placeholder).',
    });
    setIsSubmittingPublish(false);
    // TODO: Implement actual API call to publish post
    // Potentially redirect or update UI state
  }

  // Combined handler to decide which action based on clicked button
  const onSubmit = (values: NewPostFormData) => {
    // This function might not be directly used if buttons have specific handlers
    console.log('Form submitted with values:', values);
  };

  const handleSaveDraftClick = () => {
    form.handleSubmit(onSaveDraft)();
  };

  const handlePublishClick = () => {
    form.handleSubmit(onPublish)();
  };

  // Handle Cancel click
  const handleCancelClick = () => {
     // TODO: Implement logic to delete the current draft if it exists
     console.log("Deleting draft (Placeholder) and navigating back to admin.");
     // Navigate back to the admin dashboard
     router.push('/admin');
   };


  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold">Create New Post</h1>
        {/* Removed Back to Admin button, only Cancel remains */}
        <Button variant="outline" onClick={handleCancelClick}>Cancel</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content Column (Left/Top on Mobile) */}
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
                        {/* Placeholder for Rich Text Editor */}
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
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column (Right/Bottom on Mobile) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Publish Card */}
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Last Updated Placeholder */}
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

             {/* Details Card */}
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
                       <FormDescription>
                         URL-friendly version of the title. Leave blank to auto-generate.
                       </FormDescription>
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

                {/* Placeholder for Time Picker */}
                 <FormItem>
                   <FormLabel>Publish Time (Optional)</FormLabel>
                   <FormControl>
                     <Input type="time" placeholder="HH:MM" disabled />
                   </FormControl>
                   <FormDescription>Time picker coming soon.</FormDescription>
                 </FormItem>
               </CardContent>
             </Card>

            {/* Featured Image Card */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Placeholder for Image Upload */}
                 <div className="border border-dashed border-muted-foreground rounded-md p-6 text-center">
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                   <p className="text-sm text-muted-foreground">Image upload coming soon.</p>
                   <Button variant="outline" size="sm" className="mt-4" disabled>
                     Upload Image
                   </Button>
                 </div>
              </CardContent>
            </Card>

             {/* Options Card */}
             <Card>
               <CardHeader>
                 <CardTitle>Options</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <FormField
                   control={form.control}
                   name="allowComments"
                   render={({ field }) => (
                     <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                       <div className="space-y-0.5">
                          {/* Added flex container for icon and label */}
                         <FormLabel className="flex items-center gap-2 font-medium"> {/* Removed text-lg */}
                            <MessageSquare className="h-5 w-5 text-muted-foreground" /> {/* Increased icon size */}
                            Allow Comments
                         </FormLabel>
                         {/* FormDescription removed */}
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
                        <div className="space-y-0.5">
                           {/* Added flex container for icon and label */}
                          <FormLabel className="flex items-center gap-2 font-medium"> {/* Removed text-lg */}
                            <Star className="h-5 w-5 text-muted-foreground" /> {/* Increased icon size */}
                             Featured Post
                          </FormLabel>
                          {/* FormDescription removed */}
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
