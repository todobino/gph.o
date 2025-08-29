
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { User } from 'firebase/auth';

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { updateUserProfile } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { UserCircle } from 'lucide-react';

const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }).optional(),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }).optional(),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileTabProps {
  user: User;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: user.email || '',
      firstName: '',
      lastName: '',
    },
  });

  useEffect(() => {
    // Fetch user profile from Firestore to populate names
    const fetchProfile = async () => {
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            form.reset({
                email: user.email || '',
                firstName: data.firstName || '',
                lastName: data.lastName || '',
            });
        }
    };
    fetchProfile();
  }, [user, form]);


  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    try {
        await updateUserProfile(user.uid, {
            firstName: data.firstName,
            lastName: data.lastName,
            // email is not updated here, as it requires special handling
        });

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: 'An error occurred while updating your profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800/50 p-3 rounded-lg">
                <UserCircle className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="flex-grow">
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                This is how your name appears on the site.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your first name" {...field} />
                        </FormControl>
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
                        <FormControl>
                            <Input placeholder="Your last name" {...field} />
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
                            <Input {...field} readOnly disabled />
                        </FormControl>
                        <FormDescription>Your email address is not editable.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
