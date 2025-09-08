
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
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import type { Course } from '@/types/course';
import { useRouter } from 'next/navigation';

const editCourseSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  shortDescription: z.string().optional(),
  type: z.enum(['live', 'self-paced']),
  defaultSeatCapacity: z.coerce.number().int().optional(),
  priceDollars: z.coerce.number().optional(), // Changed from priceCents
  format: z.enum(['remote', 'in-person', 'hybrid']).optional(),
  sessionCount: z.coerce.number().int().optional(),
  hoursPerSession: z.coerce.number().optional(),
});

type EditCourseFormValues = z.infer<typeof editCourseSchema>;

interface EditCourseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onCourseUpdated: () => void;
}

export function EditCourseDetailsDialog({ isOpen, onOpenChange, course, onCourseUpdated }: EditCourseDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditCourseFormValues>({
    resolver: zodResolver(editCourseSchema),
    defaultValues: {
      title: course.title || '',
      shortDescription: course.shortDescription || '',
      type: course.type,
      defaultSeatCapacity: course.defaultSeatCapacity || undefined,
      priceDollars: course.priceCents !== undefined && course.priceCents !== null ? course.priceCents / 100 : undefined,
      format: course.format || undefined,
      sessionCount: course.sessionCount || undefined,
      hoursPerSession: course.hoursPerSession || undefined,
    },
  });

  const handleFormSubmit = async (values: EditCourseFormValues) => {
    setIsSubmitting(true);
    try {
      const courseRef = doc(db, 'courses', course.id);
      
      const { priceDollars, ...restOfValues } = values;

      const dataToUpdate: Partial<Course> & { updatedAt: any } = {
        ...restOfValues,
        defaultSeatCapacity: values.defaultSeatCapacity === undefined ? null : values.defaultSeatCapacity,
        priceCents: priceDollars !== undefined && priceDollars !== null ? Math.round(priceDollars * 100) : null,
        sessionCount: values.sessionCount === undefined ? null : values.sessionCount,
        hoursPerSession: values.hoursPerSession === undefined ? null : values.hoursPerSession,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(courseRef, dataToUpdate);

      toast({
        title: 'Course Updated',
        description: 'The course details have been successfully saved.',
      });

      onCourseUpdated(); // Refresh data on the parent page
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: 'Error',
        description: 'Failed to update course. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Course Details</DialogTitle>
          <DialogDescription>
            Make changes to the core details of your course here.
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
                    <Input {...field} />
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
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="self-paced">Self-Paced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="in-person">In-Person</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priceDollars"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (in dollars)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="defaultSeatCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Seats</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                control={form.control}
                name="sessionCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sessions</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hoursPerSession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Length (Hours)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
