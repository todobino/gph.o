
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import type { Course, Cohort } from '@/types/course';
import { cn } from '@/lib/utils';
import { format, addHours, parse } from 'date-fns';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';

const sessionSchema = z.object({
  date: z.date({ required_error: 'A date is required.' }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
});

const editCohortScheduleSchema = z.object({
  sessions: z.array(sessionSchema).min(1, "You must add at least one session."),
});

type EditCohortScheduleFormValues = z.infer<typeof editCohortScheduleSchema>;

interface EditCohortScheduleDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  cohort: Cohort;
  onCohortUpdated: () => void;
}

export function EditCohortScheduleDrawer({ isOpen, onOpenChange, course, cohort, onCohortUpdated }: EditCohortScheduleDrawerProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditCohortScheduleFormValues>({
    resolver: zodResolver(editCohortScheduleSchema),
    defaultValues: {
      sessions: [],
    },
  });
  
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "sessions",
  });
  
  useEffect(() => {
    if (isOpen && cohort) {
      const initialSessions = cohort.sessions.map(s => ({
        date: s.startAt.toDate(),
        startTime: format(s.startAt.toDate(), 'HH:mm'),
      }));
      form.reset({ sessions: initialSessions });
    }
  }, [isOpen, cohort, form]);

  const handleFormSubmit = async (values: EditCohortScheduleFormValues) => {
    setIsSubmitting(true);
    try {
        const cohortRef = doc(db, 'courses', course.id, 'cohorts', cohort.id);
        
        const sessionsWithTimestamps = values.sessions.map((session, index) => {
            const startDateTime = new Date(session.date);
            const [startHours, startMinutes] = session.startTime.split(':').map(Number);
            startDateTime.setHours(startHours, startMinutes, 0, 0);

            const endDateTime = addHours(startDateTime, course.hoursPerSession || 2);

            return {
                label: `Session on ${format(startDateTime, 'MMM d')}`,
                startAt: Timestamp.fromDate(startDateTime),
                endAt: Timestamp.fromDate(endDateTime),
            }
        });

        await updateDoc(cohortRef, {
            sessions: sessionsWithTimestamps,
            updatedAt: serverTimestamp(),
        });

      toast({
        title: 'Schedule Updated',
        description: `The schedule for "${cohort.name}" has been saved.`,
      });

      onCohortUpdated();
      onOpenChange(false);

    } catch (error) {
      console.error('Error updating cohort schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to update schedule. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEndTime = (startTime: string) => {
    if (!/^\d{2}:\d{2}$/.test(startTime)) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = addHours(startDate, course.hoursPerSession || 2);
    return format(endDate, 'h:mm a');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Edit Cohort Schedule</SheetTitle>
          <SheetDescription>
            Adjust the session dates and times for this cohort.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex-grow flex flex-col">
            <div className="space-y-6 px-6 py-4 overflow-y-auto flex-grow">
              <div>
                <FormLabel>Sessions</FormLabel>
                <div className="space-y-3 mt-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-end p-3 border rounded-lg w-full">
                            <div className="flex-1 flex items-end gap-2">
                               <FormField
                                  control={form.control}
                                  name={`sessions.${index}.date`}
                                  render={({ field }) => (
                                    <FormItem className="flex flex-col flex-grow">
                                      <FormLabel className="text-xs">Date</FormLabel>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <FormControl>
                                            <Button
                                              variant={"outline"}
                                              className={cn(
                                                "w-full pl-3 text-left font-normal justify-start",
                                                !field.value && "text-muted-foreground"
                                              )}
                                            >
                                              {field.value ? (
                                                format(field.value, "MM/dd/yy")
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
                                        <FormItem className="flex-grow w-40">
                                            <FormLabel className="text-xs">Start Time</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="time" className="w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <div className="flex-grow">
                                     <FormLabel className="text-xs">End Time</FormLabel>
                                    <div className="h-10 flex items-center px-3 text-sm text-muted-foreground">
                                        (~{renderEndTime(form.watch(`sessions.${index}.startTime`))})
                                    </div>
                                 </div>
                            </div>
                            <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ date: new Date(), startTime: '13:00' })}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Session
                    </Button>
                    <FormMessage>{form.formState.errors.sessions?.root?.message}</FormMessage>
                </div>
              </div>
            </div>

            <SheetFooter className="px-6 py-4 border-t bg-background">
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </SheetClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
