'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
// import { saveContactMessage } from '@/lib/firestore'; // Assuming Firestore function exists

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }).max(1000, {
    message: 'Message cannot exceed 1000 characters.'
  }),
});

export type ContactFormData = z.infer<typeof formSchema>;

// Placeholder function for saving data - replace with actual Firestore call
async function saveContactMessage(data: ContactFormData): Promise<{ success: boolean, error?: string }> {
    console.log("Submitting contact message (placeholder):", data);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate potential failure
    // if (Math.random() < 0.2) {
    //   return { success: false, error: "Failed to save message. Please try again." };
    // }

    // TODO: Implement actual Firestore saving logic here
    // Example:
    // try {
    //   const docRef = await addDoc(collection(db, "contactMessages"), {
    //     ...data,
    //     submittedAt: serverTimestamp()
    //   });
    //   console.log("Document written with ID: ", docRef.id);
    //   return { success: true };
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    //   return { success: false, error: "An error occurred while saving the message." };
    // }
     return { success: true };
}


export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Define your form.
  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: ContactFormData) {
    setIsSubmitting(true);
    try {
        // TODO: Replace with actual call to save data to Firestore
        const result = await saveContactMessage(values);

        if (result.success) {
            toast({
              title: 'Message Sent!',
              description: "Thanks for reaching out. We'll get back to you soon.",
            });
            form.reset(); // Clear the form on successful submission
        } else {
             toast({
                title: 'Submission Failed',
                description: result.error || 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
        }

    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Submission Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your message..."
                  className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
               <FormDescription>
                 Briefly describe your inquiry. (Max 1000 characters)
               </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  );
}
