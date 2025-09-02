
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore';

const NEWSLETTER_LIST_ID = 'newsletter';

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

export type EmailSignupFormData = z.infer<typeof formSchema>;

interface EmailSignupFormProps {
  buttonText?: string;
  listId?: string;
  formClassName?: string;
  buttonClassName?: string;
}

export function EmailSignupForm({
  buttonText = 'Subscribe',
  listId = NEWSLETTER_LIST_ID,
  formClassName,
  buttonClassName,
}: EmailSignupFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EmailSignupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  async function onSubmit(values: EmailSignupFormData) {
    setIsSubmitting(true);
    const cleanEmail = values.email.trim().toLowerCase();

    try {
      // For anonymous signups, the UID is the email address.
      const subscriberRef = doc(db, 'subscribers', cleanEmail);
      const subscriptionRef = doc(db, 'subscriptions', `${cleanEmail}_${listId}`);

      await setDoc(subscriberRef, {
        id: cleanEmail,
        email: cleanEmail,
        displayName: values.name,
        status: 'active', // Assuming single opt-in for simplicity based on new rules
        source: 'web_form',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      await setDoc(subscriptionRef, {
        id: `${cleanEmail}_${listId}`,
        subscriberId: cleanEmail,
        listId: listId,
        status: 'subscribed',
        channel: 'email',
        subscribedAt: serverTimestamp(),
        lastChangedAt: serverTimestamp(),
      });
      
      toast({
        title: 'Subscription Successful!',
        description: "You've been added to the list.",
      });
      form.reset();

    } catch (error) {
      console.error('Signup form submission error:', error);
      toast({
        title: 'Subscription Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", formClassName)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className={cn("w-full", buttonClassName)} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : buttonText}
        </Button>
      </form>
    </Form>
  );
}
