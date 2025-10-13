

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useIsAdmin } from '@/hooks/useUser';
import { getDoc, doc, collection, query, where, getDocs, orderBy, Timestamp, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import type { Course, Cohort, CohortSession } from '@/types/course';
import type { Attendee } from '@/types/attendee';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Edit, Mail, Plus, User, Users, ExternalLink, Pencil, Info, AlertTriangle, Link as LinkIcon, Check, CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, addHours } from 'date-fns';
import { AddAttendeeDialog } from '@/components/admin/add-attendee-dialog';
import { EditAttendeeDrawer } from '@/components/admin/edit-attendee-drawer';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { EditCohortScheduleDrawer } from '@/components/admin/edit-cohort-schedule-drawer';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';


function CohortSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-9 w-48" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-9 w-32" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                     <Skeleton className="h-64 w-full" />
                </div>
                <div>
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
    );
}

const sessionEditSchema = z.object({
  date: z.date({ required_error: "A date is required." }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
});
type SessionEditFormValues = z.infer<typeof sessionEditSchema>;

function EditSessionDialog({
    isOpen,
    onOpenChange,
    course,
    cohort,
    session,
    sessionIndex,
    onSessionUpdated,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    course: Course;
    cohort: Cohort;
    session: CohortSession;
    sessionIndex: number;
    onSessionUpdated: () => void;
}) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<SessionEditFormValues>({
        resolver: zodResolver(sessionEditSchema),
    });

    useEffect(() => {
        if (isOpen && session) {
            form.reset({
                date: session.startAt.toDate(),
                startTime: format(session.startAt.toDate(), "HH:mm"),
            });
        }
    }, [isOpen, session, form]);

    if (!session) return null;

    const handleSubmit = async (values: SessionEditFormValues) => {
        setIsSubmitting(true);
        try {
            const startDateTime = new Date(values.date);
            const [startHours, startMinutes] = values.startTime.split(":").map(Number);
            startDateTime.setHours(startHours, startMinutes, 0, 0);

            const endDateTime = addHours(startDateTime, course.hoursPerSession || 2);

            const updatedSession: CohortSession = {
                label: `Session on ${format(startDateTime, "MMM d")}`,
                startAt: Timestamp.fromDate(startDateTime),
                endAt: Timestamp.fromDate(endDateTime),
            };

            const updatedSessions = [...cohort.sessions];
            updatedSessions[sessionIndex] = updatedSession;

            const cohortRef = doc(db, 'courses', course.id, 'cohorts', cohort.id);
            await updateDoc(cohortRef, {
                sessions: updatedSessions,
                updatedAt: serverTimestamp(),
            });

            toast({
                title: "Session Updated",
                description: `Session ${sessionIndex + 1} has been successfully updated.`,
            });
            onSessionUpdated();
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating session:", error);
            toast({
                title: "Error",
                description: "Failed to update the session. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Session {sessionIndex + 1}</DialogTitle>
                    <DialogDescription>Update the date and time for this session.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn("w-full pl-3 text-left font-normal justify-start", !field.value && "text-muted-foreground")}
                                                >
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarComponent
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function EditPaymentLinkDialog({ isOpen, onOpenChange, courseId, cohort, onLinkUpdated }: { isOpen: boolean, onOpenChange: (open: boolean) => void, courseId: string, cohort: Cohort, onLinkUpdated: () => void }) {
    const { toast } = useToast();
    const [link, setLink] = useState(cohort.checkoutLink || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLink(cohort.checkoutLink || '');
        }
    }, [isOpen, cohort.checkoutLink]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const cohortRef = doc(db, 'courses', courseId, 'cohorts', cohort.id);
            await updateDoc(cohortRef, {
                checkoutLink: link,
                updatedAt: serverTimestamp(),
            });
            toast({
                title: 'Checkout Link Updated',
                description: 'The link has been successfully saved.',
            });
            onLinkUpdated();
            onOpenChange(false);
        } catch (error) {
            console.error('Error updating checkout link:', error);
            toast({
                title: 'Error',
                description: 'Failed to update the link. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Checkout Link</DialogTitle>
                    <DialogDescription>
                        Update the payment or registration link for this cohort.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="py-4">
                        <Label htmlFor="checkoutLink" className="sr-only">Checkout Link</Label>
                        <Input
                            id="checkoutLink"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="https://your-payment-provider.com/..."
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Link'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function EditCohortPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const cohortId = params.cohortId as string;
    const isAdmin = useIsAdmin();
    const { toast } = useToast();

    const [course, setCourse] = useState<Course | null>(null);
    const [cohort, setCohort] = useState<Cohort | null>(null);
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddAttendeeDialogOpen, setIsAddAttendeeDialogOpen] = useState(false);
    const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isEditDetailsDrawerOpen, setIsEditDetailsDrawerOpen] = useState(false);
    const [isEditScheduleDrawerOpen, setIsEditScheduleDrawerOpen] = useState(false);
    const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
    const [isPaymentLinkDialogOpen, setIsPaymentLinkDialogOpen] = useState(false);

    const [selectedSession, setSelectedSession] = useState<{ session: CohortSession; index: number } | null>(null);
    const [isEditSessionDialogOpen, setIsEditSessionDialogOpen] = useState(false);


    const fetchCohortDetails = async (courseIdParam?: string) => {
        setLoading(true);
        try {
            let courseId = courseIdParam || course?.id;
            if (!courseId) {
                const courseQuery = query(collection(db, "courses"), where("slug", "==", slug));
                const courseSnapshot = await getDocs(courseQuery);
                if (courseSnapshot.empty) throw new Error("Course not found.");
                const courseDoc = courseSnapshot.docs[0];
                courseId = courseDoc.id;
                setCourse({ id: courseDoc.id, ...courseDoc.data() } as Course);
            }

            const cohortRef = doc(db, "courses", courseId, "cohorts", cohortId);
            const cohortSnap = await getDoc(cohortRef);
            if (!cohortSnap.exists()) throw new Error("Cohort not found.");
            setCohort({ id: cohortSnap.id, ...cohortSnap.data() } as Cohort);

            const attendeesQuery = query(collection(db, "courses", courseId, "cohorts", cohortId, "attendees"), orderBy("addedAt", "desc"));
            const attendeesSnapshot = await getDocs(attendeesQuery);
            const attendeesData = attendeesSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Attendee));
            setAttendees(attendeesData);

        } catch (err: any) {
            console.error("Error fetching cohort details:", err);
            setError(err.message || "Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin && slug && cohortId) {
            fetchCohortDetails();
        }
    }, [isAdmin, slug, cohortId]);
    
    useEffect(() => {
        if (!isEditDrawerOpen) {
            setSelectedAttendee(null);
        }
    }, [isEditDrawerOpen]);
    
    const handlePublishCohort = async () => {
        if (!course || !cohort) return;
        try {
            const cohortRef = doc(db, "courses", course.id, "cohorts", cohort.id);
            await updateDoc(cohortRef, {
                status: 'published',
                updatedAt: serverTimestamp(),
            });
            toast({
                title: 'Cohort Published!',
                description: `${cohort.name} is now live and can accept registrations.`,
            });
            fetchCohortDetails(); // Re-fetch to update UI
        } catch (error) {
            console.error("Error publishing cohort:", error);
            toast({
                title: 'Error',
                description: 'Failed to publish the cohort. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsPublishDialogOpen(false);
        }
    };

    const handleAttendeeRowClick = (attendee: Attendee) => {
        setSelectedAttendee(attendee);
        setIsEditDrawerOpen(true);
    };

    const handleSessionRowClick = (session: CohortSession, index: number) => {
        setSelectedSession({ session, index });
        setIsEditSessionDialogOpen(true);
    };

    const formatSessionTime = (timestamp: Timestamp) => {
        if (!timestamp) return 'N/A';
        return format(timestamp.toDate(), 'h:mm a');
    };

    const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };

    const formatLongDate = (date: Date) => {
        const day = date.getDate();
        return format(date, `EEEE, MMMM d'${getOrdinal(day)}'`);
    };

    const formatShortDate = (date: Date) => {
        return format(date, 'MM/dd/yyyy');
    };


    if (loading || isAdmin === undefined) {
        return <CohortSkeleton />;
    }

    if (!isAdmin) {
        return <p className="text-destructive">You do not have permission to view this page.</p>;
    }

    if (error) {
        return <p className="text-destructive">{error}</p>;
    }

    if (!course || !cohort) {
        return <p>Data could not be loaded.</p>;
    }

    const cohortStatusBadge = (
        <Badge
            variant={cohort.status === 'published' ? 'default' : cohort.status === 'draft' ? 'outline' : 'secondary'}
            className={cn("capitalize px-4 py-2", 
                cohort.status === 'draft' && "cursor-pointer hover:bg-accent",
                cohort.status === 'published' && 'bg-green-600 hover:bg-green-700 text-white'
            )}
            onClick={() => cohort.status === 'draft' && setIsPublishDialogOpen(true)}
        >
            {cohort.status === 'published' && <Check className="mr-1 h-4 w-4" />}
            {cohort.status}
        </Badge>
    );
    
    const totalHours = (course.hoursPerSession || 0) * cohort.sessions.length;

    const attendeeStatusBadge = (status: Attendee['status']) => {
        switch (status) {
            case 'confirmed':
                return <Badge variant="default" className="capitalize bg-green-600 hover:bg-green-700 text-white">{status}</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="capitalize bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">{status}</Badge>;
            case 'waitlisted':
                return <Badge variant="outline" className="capitalize">{status}</Badge>;
            case 'cancelled':
                return <Badge variant="destructive" className="capitalize bg-red-100 text-red-700 border-red-200 hover:bg-red-200">{status}</Badge>;
            default:
                return <Badge variant="secondary" className="capitalize">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <AddAttendeeDialog 
                isOpen={isAddAttendeeDialogOpen}
                onOpenChange={setIsAddAttendeeDialogOpen}
                courseId={course.id}
                cohortId={cohort.id}
                onAttendeeAdded={() => fetchCohortDetails()}
            />
             {selectedAttendee && (
                <EditAttendeeDrawer
                    isOpen={isEditDrawerOpen}
                    onOpenChange={setIsEditDrawerOpen}
                    attendee={selectedAttendee}
                    courseId={course.id}
                    cohortId={cohort.id}
                    onAttendeeUpdated={() => fetchCohortDetails()}
                />
            )}
             <Sheet open={isEditDetailsDrawerOpen} onOpenChange={setIsEditDetailsDrawerOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit Cohort Details</SheetTitle>
                        <SheetDescription>
                            Make changes to the cohort details here. Click save when you're done.
                        </SheetDescription>
                    </SheetHeader>
                    {/* Form to edit details will go here */}
                </SheetContent>
            </Sheet>
            <EditCohortScheduleDrawer
                isOpen={isEditScheduleDrawerOpen}
                onOpenChange={setIsEditScheduleDrawerOpen}
                course={course}
                cohort={cohort}
                onCohortUpdated={fetchCohortDetails}
            />

            {selectedSession && (
                <EditSessionDialog
                    isOpen={isEditSessionDialogOpen}
                    onOpenChange={setIsEditSessionDialogOpen}
                    course={course}
                    cohort={cohort}
                    session={selectedSession.session}
                    sessionIndex={selectedSession.index}
                    onSessionUpdated={fetchCohortDetails}
                />
            )}


            <AlertDialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ready to Publish This Cohort?</AlertDialogTitle>
                        <AlertDialogDescription>
                           You are about to make <span className="font-bold">{cohort.name}</span> public. Please review the details before confirming.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="text-sm space-y-2 my-4 p-4 bg-muted rounded-md">
                        <p><span className="font-semibold">Name:</span> {cohort.name}</p>
                        <p><span className="font-semibold">Starts:</span> {formatLongDate(cohort.sessions[0].startAt.toDate())}</p>
                        <p><span className="font-semibold">Ends:</span> {formatLongDate(cohort.sessions[cohort.sessions.length - 1].startAt.toDate())}</p>
                        <p><span className="font-semibold">Total Seats:</span> {cohort.seatsTotal}</p>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePublishCohort}>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Confirm & Publish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <EditPaymentLinkDialog
                isOpen={isPaymentLinkDialogOpen}
                onOpenChange={setIsPaymentLinkDialogOpen}
                courseId={course.id}
                cohort={cohort}
                onLinkUpdated={() => fetchCohortDetails()}
            />


            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="secondary" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="text-3xl md:text-4xl font-bold font-heading break-words">
                       {cohort.name}
                    </h1>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsPaymentLinkDialogOpen(true)}>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Change Payment Link
                    </Button>
                    {cohortStatusBadge}
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader className="flex-row items-center justify-between py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800/50 p-2 rounded-lg">
                                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                </div>
                                <CardTitle>Schedule</CardTitle>
                            </div>
                            <Button size="sm" onClick={() => setIsEditScheduleDrawerOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add
                            </Button>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-3">
                             <div className="space-y-2 mb-4">
                                <div className="flex justify-around items-center text-center p-3 bg-secondary rounded-md">
                                    <div>
                                        <div className="font-bold text-lg">{cohort.sessions.length}</div>
                                        <div className="text-xs text-muted-foreground">Sessions</div>
                                    </div>
                                    <Separator orientation="vertical" className="h-8" />
                                    <div>
                                        <div className="font-bold text-lg">{course.hoursPerSession || 0}</div>
                                        <div className="text-xs text-muted-foreground">Hrs Each</div>
                                    </div>
                                    <Separator orientation="vertical" className="h-8" />
                                    <div>
                                        <div className="font-bold text-lg">{totalHours}</div>
                                        <div className="text-xs text-muted-foreground">Hrs Total</div>
                                    </div>
                                </div>
                            </div>
                            {cohort.sessions.map((session, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-4 rounded-lg border p-3 hover:bg-accent hover:border-primary cursor-pointer"
                                    onClick={() => handleSessionRowClick(session, index)}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-bold text-lg">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{formatLongDate(session.startAt.toDate())}</p>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                            <span>{formatShortDate(session.startAt.toDate())}</span>
                                            <span>&bull;</span>
                                            <span>{formatSessionTime(session.startAt)} - {formatSessionTime(session.endAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                
                {/* Right Column */}
                <div className="space-y-8">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800/50 p-2 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                </div>
                                <CardTitle>Attendees</CardTitle>
                            </div>
                            <Button size="sm" onClick={() => setIsAddAttendeeDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-around items-center text-center p-3 bg-secondary rounded-md">
                                    <div>
                                        <div className="font-bold text-lg">{cohort.seatsConfirmed}</div>
                                        <div className="text-xs text-muted-foreground">Confirmed</div>
                                    </div>
                                    <Separator orientation="vertical" className="h-8" />
                                    <div>
                                        <div className="font-bold text-lg">{cohort.seatsHeld}</div>
                                        <div className="text-xs text-muted-foreground">Held</div>
                                    </div>
                                    <Separator orientation="vertical" className="h-8" />
                                    <div>
                                        <div className="font-bold text-lg">{cohort.seatsRemaining}</div>
                                        <div className="text-xs text-muted-foreground">Remaining</div>
                                    </div>
                                </div>
                            </div>
                           {attendees.length > 0 ? (
                            <div className="space-y-3 mt-4">
                                {attendees.map(attendee => (
                                    <div 
                                        key={attendee.id} 
                                        className="flex items-center p-3 border rounded-lg hover:bg-accent hover:border-primary cursor-pointer"
                                        onClick={() => handleAttendeeRowClick(attendee)}
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{attendee.firstName} {attendee.lastName}</p>
                                            <p className="text-xs text-muted-foreground">{attendee.email}</p>
                                        </div>
                                        {attendeeStatusBadge(attendee.status)}
                                    </div>
                                ))}
                            </div>
                           ) : (
                             <p className="text-center text-muted-foreground py-8">No attendees enrolled yet.</p>
                           )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

    

    

    

    

    

    

    