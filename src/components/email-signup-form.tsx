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
// import { subscribeContact } from '@/services/mailchimp'; // Or use convertkit or firestore function

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

// Placeholder function for subscribing - replace with actual Mailchimp/ConvertKit/Firestore call
async function subscribeEmail(data: EmailSignupFormData): Promise<{ success: boolean, error?: string }> {
    console.log("Subscribing email (placeholder):", data);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate potential failure
    // if (Math.random() < 0.2) {
    //    return { success: false, error: "Failed to subscribe. Please try again." };
    // }

    // TODO: Implement actual subscription logic (Mailchimp, ConvertKit, or Firestore)
    // Example (using a generic service function):
    // const success = await subscribeContact(data); // Assuming subscribeContact handles the API call
    // if (!success) {
    //    return { success: false, error: "Could not subscribe. Please check your details or try again later." };
    // }
    return { success: true };
}


export function EmailSignupForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Define your form.
  const form = useForm<EmailSignupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: EmailSignupFormData) {
     setIsSubmitting(true);
    try {
      // TODO: Replace with actual call to subscribe service
      const result = await subscribeEmail(values);

       if (result.success) {
            toast({
            title: 'Subscription Successful!',
            description: "You're signed up for updates.",
            });
            form.reset(); // Clear the form
       } else {
            toast({
                title: 'Subscription Failed',
                description: result.error || 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
       }

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    </Form>
  );
}
