
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
  listId,
  formClassName,
  buttonClassName,
}: EmailSignupFormProps) {
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
      const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, listId }),
      });

      const result = await response.json();

       if (result.ok) {
            toast({
            title: 'Subscription Pending!',
            description: "Please check your email to confirm your subscription.",
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
