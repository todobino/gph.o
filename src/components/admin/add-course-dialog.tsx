
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { useRouter } from 'next/navigation';
import type { Course } from '@/types/course';

const addCourseSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  shortDescription: z.string().optional(),
  type: z.enum(['live', 'self-paced'], {
    required_error: 'You need to select a course type.',
  }),
});

type AddCourseFormValues = z.infer<typeof addCourseSchema>;

interface AddCourseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Function to generate a URL-friendly slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric characters
    .trim()
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
};

export function AddCourseDialog({ isOpen, onOpenChange }: AddCourseDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddCourseFormValues>({
    resolver: zodResolver(addCourseSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      type: undefined,
    },
  });

  const handleFormSubmit = async (values: AddCourseFormValues) => {
    setIsSubmitting(true);
    try {
      const slug = createSlug(values.title);

      const newCourseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'> = {
        title: values.title,
        slug,
        type: values.type,
        shortDescription: values.shortDescription || '',
        active: false, // Courses are created as drafts
        // Set default values for other required fields
        bullets: [],
        tags: [],
        format: 'remote',
        priceCents: 0,
        currency: 'USD',
      };
      
      const docRef = await addDoc(collection(db, 'courses'), {
          ...newCourseData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Course Created',
        description: 'The new course has been successfully created as a draft.',
      });

      form.reset();
      onOpenChange(false);
      router.push(`/admin/courses/${slug}`);

    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: 'Error',
        description: 'Failed to create course. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Start by providing a title, type, and optional short description.
            You can add more details after creation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Leading Technical Change" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief one-sentence summary of the course." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="live">Live (Cohort-based)</SelectItem>
                      <SelectItem value="self-paced">Self-Paced (LMS)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Course'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
