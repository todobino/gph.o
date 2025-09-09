
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
import { Textarea } from '../ui/textarea';
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
import type { Attendee, AttendeeStatus, PaymentStatus } from '@/types/attendee';

const addAttendeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Invalid email address.'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'waitlisted']),
  paymentStatus: z.enum(['unpaid', 'paid', 'refunded', 'pending']),
  billingName: z.string().optional(),
  billingEmail: z.string().email('Invalid billing email.').optional().or(z.literal('')),
  billingAddress: z.string().optional(),
});

type AddAttendeeFormValues = z.infer<typeof addAttendeeSchema>;

interface AddAttendeeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  cohortId: string;
  onAttendeeAdded: () => void;
}

export function AddAttendeeDialog({ isOpen, onOpenChange, courseId, cohortId, onAttendeeAdded }: AddAttendeeDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddAttendeeFormValues>({
    resolver: zodResolver(addAttendeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      status: 'pending',
      paymentStatus: 'unpaid',
      billingName: '',
      billingEmail: '',
      billingAddress: '',
    },
  });

  const handleFormSubmit = async (values: AddAttendeeFormValues) => {
    setIsSubmitting(true);
    try {
      const attendeesRef = collection(db, 'courses', courseId, 'cohorts', cohortId, 'attendees');
      
      const newAttendeeData: Omit<Attendee, 'id' | 'addedAt'> = {
        ...values,
        addedAt: serverTimestamp() as any, // Let server set the timestamp
      };

      await addDoc(attendeesRef, newAttendeeData);

      toast({
        title: 'Attendee Added',
        description: `${values.firstName} ${values.lastName} has been added to the cohort.`,
      });

      onAttendeeAdded();
      onOpenChange(false);
      form.reset();

    } catch (error) {
      console.error('Error adding attendee:', error);
      toast({
        title: 'Error',
        description: 'Failed to add attendee. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Attendee</DialogTitle>
          <DialogDescription>
            Manually add a new attendee to this cohort. An email is not sent automatically.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-2">
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl><Input type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Enrollment Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="waitlisted">Waitlisted</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="paymentStatus"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Payment Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="unpaid">Unpaid</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <h3 className="text-md font-semibold pt-4 border-b pb-2">Billing Information (Optional)</h3>

             <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="billingName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Billing Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="billingEmail"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Billing Email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <FormField
              control={form.control}
              name="billingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Address</FormLabel>
                  <FormControl><Textarea rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 sticky bottom-0 bg-background pb-1">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Attendee'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
