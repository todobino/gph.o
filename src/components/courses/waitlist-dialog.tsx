
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";


const waitlistSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  courseId: z.string(),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

async function submitToWaitlist(data: WaitlistFormData): Promise<{ success: boolean }> {
  console.log("Adding to waitlist:", data);
  // Here you would typically make an API call to your backend
  // For example:
  // const response = await fetch('/api/waitlist', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // return response.json();
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}


interface WaitlistDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string | null;
}

export function WaitlistDialog({ isOpen, onOpenChange, courseId }: WaitlistDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      courseId: courseId || "",
    },
  });

  // Update default courseId when it changes
  if (courseId && form.getValues("courseId") !== courseId) {
    form.setValue("courseId", courseId);
  }

  const handleFormSubmit = async (values: WaitlistFormData) => {
    setIsSubmitting(true);
    const result = await submitToWaitlist(values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "You're on the waitlist!",
        description: "We'll notify you if a seat becomes available.",
      });
      onOpenChange(false);
      form.reset();
    } else {
      toast({
        title: "Something went wrong",
        description: "Could not add you to the waitlist. Please try again.",
        variant: "destructive",
      });
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join the Waitlist</DialogTitle>
          <DialogDescription>
            This course is currently full. Enter your details below to be notified if a spot opens up.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
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
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Join Waitlist"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
