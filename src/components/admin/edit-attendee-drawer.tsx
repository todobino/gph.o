
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import type { Attendee } from '@/types/attendee';
import { Separator } from '../ui/separator';

const editAttendeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Invalid email address.'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'waitlisted']),
  paymentStatus: z.enum(['unpaid', 'paid', 'refunded', 'pending']),
  billingName: z.string().optional(),
  billingEmail: z.string().email('Invalid billing email.').optional().or(z.literal('')),
  billingAddress: z.string().optional(),
  notes: z.string().optional(),
});

type EditAttendeeFormValues = z.infer<typeof editAttendeeSchema>;

interface EditAttendeeDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  attendee: Attendee;
  courseId: string;
  cohortId: string;
  onAttendeeUpdated: () => void;
}

export function EditAttendeeDrawer({ isOpen, onOpenChange, attendee, courseId, cohortId, onAttendeeUpdated }: EditAttendeeDrawerProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditAttendeeFormValues>({
    resolver: zodResolver(editAttendeeSchema),
  });
  
  useEffect(() => {
    if (attendee) {
      form.reset({
        firstName: attendee.firstName || '',
        lastName: attendee.lastName || '',
        email: attendee.email || '',
        status: attendee.status || 'pending',
        paymentStatus: attendee.paymentStatus || 'unpaid',
        billingName: attendee.billingName || '',
        billingEmail: attendee.billingEmail || '',
        billingAddress: attendee.billingAddress || '',
        notes: attendee.notes || '',
      });
    }
  }, [attendee, form]);


  const handleFormSubmit = async (values: EditAttendeeFormValues) => {
    setIsSubmitting(true);
    try {
      const attendeeRef = doc(db, 'courses', courseId, 'cohorts', cohortId, 'attendees', attendee.id);

      await updateDoc(attendeeRef, {
        ...values,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Attendee Updated',
        description: `Details for ${values.firstName} ${values.lastName} have been saved.`,
      });

      onAttendeeUpdated();
      onOpenChange(false);

    } catch (error) {
      console.error('Error updating attendee:', error);
      toast({
        title: 'Error',
        description: 'Failed to update attendee. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                <SheetTitle>Edit Attendee</SheetTitle>
                <SheetDescription>
                    Update details for {attendee.firstName} {attendee.lastName}.
                </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-4 px-6 py-4 flex-grow overflow-y-auto">
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
                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Enrollment Status</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
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
                                <Select onValueChange={field.onChange} value={field.value}>
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

                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl><Textarea rows={3} {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                     <Separator />
                    <h3 className="text-md font-semibold pt-2">Billing Information</h3>

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
