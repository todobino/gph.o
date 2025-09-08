
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { useRouter } from 'next/navigation';
import type { Course, Cohort } from '@/types/course';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';

const sessionSchema = z.object({
  date: z.date({ required_error: 'A date is required.' }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
});

const addCohortSchema = z.object({
  number: z.coerce.number().int().positive({ message: 'Cohort number must be a positive integer.' }),
  status: z.enum(['draft', 'published', 'waitlist', 'soldout']),
  sessions: z.array(sessionSchema).min(1, "You must add at least one session."),
});

type AddCohortFormValues = z.infer<typeof addCohortSchema>;

interface AddCohortDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  cohorts: Cohort[];
  onCohortAdded: () => void;
}

export function AddCohortDialog({ isOpen, onOpenChange, course, cohorts, onCohortAdded }: AddCohortDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextCohortNumber = (cohorts && cohorts.length > 0) ? Math.max(...cohorts.map(c => c.number || 0)) + 1 : 1;

  const form = useForm<AddCohortFormValues>({
    resolver: zodResolver(addCohortSchema),
    defaultValues: {
      number: nextCohortNumber,
      status: 'draft',
      sessions: [],
    },
  });

  // When dialog opens or cohorts change, reset the number field to the next sequential one
  useEffect(() => {
    if (isOpen) {
      form.reset({
        number: nextCohortNumber,
        status: 'draft',
        sessions: [],
      });
    }
  }, [isOpen, nextCohortNumber, form]);
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sessions",
  });

  const getCourseAcronym = (title: string) => {
    return title
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
  };

  const handleFormSubmit = async (values: AddCohortFormValues) => {
    setIsSubmitting(true);
    try {
        const acronym = getCourseAcronym(course.title);
        const cohortName = `${acronym} #${values.number}`;
        const cohortCode = `${acronym.toLowerCase()}-${values.number}`;
        const cohortRef = collection(db, 'courses', course.id, 'cohorts');
        
        const sessionsWithTimestamps = values.sessions.map(session => {
            const startDateTime = new Date(session.date);
            const [startHours, startMinutes] = session.startTime.split(':').map(Number);
            startDateTime.setHours(startHours, startMinutes, 0, 0);

            const endDateTime = new Date(session.date);
            const [endHours, endMinutes] = session.endTime.split(':').map(Number);
            endDateTime.setHours(endHours, endMinutes, 0, 0);

            return {
                label: `Session on ${format(startDateTime, 'MMM d')}`,
                startAt: Timestamp.fromDate(startDateTime),
                endAt: Timestamp.fromDate(endDateTime),
            }
        });

        await addDoc(cohortRef, {
            name: cohortName,
            code: cohortCode,
            number: values.number,
            status: values.status,
            seatsTotal: course.defaultSeatCapacity || 0,
            seatsHeld: 0,
            seatsConfirmed: 0,
            seatsRemaining: course.defaultSeatCapacity || 0,
            sessions: sessionsWithTimestamps,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

      toast({
        title: 'Cohort Created',
        description: `Cohort "${cohortName}" has been successfully added.`,
      });

      onCohortAdded();
      onOpenChange(false);
      form.reset();

    } catch (error) {
      console.error('Error creating cohort:', error);
      toast({
        title: 'Error',
        description: 'Failed to create cohort. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Cohort</DialogTitle>
          <DialogDescription>
            Define a new cohort for the course: {course.title}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-2">
             <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cohort Number</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 14" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="waitlist">Waitlist</SelectItem>
                          <SelectItem value="soldout">Sold Out</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
             <div>
                <FormLabel>Sessions</FormLabel>
                <div className="space-y-3 mt-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-end p-3 border rounded-lg">
                           <FormField
                              control={form.control}
                              name={`sessions.${index}.date`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                   <FormLabel>Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-[150px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
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
                            <FormField
                                control={form.control}
                                name={`sessions.${index}.startTime`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Time</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="time" className="w-[110px]" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`sessions.${index}.endTime`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Time</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="time" className="w-[110px]" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ date: new Date(), startTime: '13:00', endTime: '15:00' })}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Session
                    </Button>
                    <FormMessage>{form.formState.errors.sessions?.message}</FormMessage>
                </div>
             </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Cohort'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
