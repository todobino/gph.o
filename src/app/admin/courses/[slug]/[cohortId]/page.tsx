

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
import { ArrowLeft, Calendar, Clock, Edit, Mail, Plus, User, Users, ExternalLink, Pencil, Info, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
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

    const handleRowClick = (attendee: Attendee) => {
        setSelectedAttendee(attendee);
        setIsEditDrawerOpen(true);
    };

    const formatSessionTime = (timestamp: Timestamp) => {
        if (!timestamp) return 'N/A';
        return format(timestamp.toDate(), 'h:mm a');
    };

    const formatSessionDate = (timestamp: Timestamp) => {
        if (!timestamp) return 'N/A';
        return format(timestamp.toDate(), 'E, MMM d, yyyy');
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
            className={cn("capitalize px-4 py-1.5", cohort.status === 'draft' && "cursor-pointer hover:bg-accent")}
            onClick={() => cohort.status === 'draft' && setIsPublishDialogOpen(true)}
        >
            {cohort.status}
        </Badge>
    );

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
                        <p><span className="font-semibold">Starts:</span> {formatSessionDate(cohort.sessions[0].startAt)}</p>
                        <p><span className="font-semibold">Ends:</span> {formatSessionDate(cohort.sessions[cohort.sessions.length - 1].startAt)}</p>
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
                    <Button variant="secondary" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                        Back
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
                            {cohort.sessions.map((session, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-4 rounded-lg border p-3 hover:bg-accent hover:border-primary cursor-pointer transition-colors"
                                    onClick={() => setIsEditScheduleDrawerOpen(true)}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-bold text-lg">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{session.label || `Session ${index + 1}`}</p>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                            <span>{formatSessionDate(session.startAt)}</span>
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
                                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800/ ৫০ p-2 rounded-lg">
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
                            <div className="space-y-3">
                                {attendees.map(attendee => (
                                    <div 
                                        key={attendee.id} 
                                        className="flex items-center p-3 border rounded-lg hover:bg-accent hover:border-primary cursor-pointer transition-colors"
                                        onClick={() => handleRowClick(attendee)}
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{attendee.firstName} {attendee.lastName}</p>
                                            <p className="text-xs text-muted-foreground">{attendee.email}</p>
                                        </div>
                                        <Badge variant={attendee.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize">{attendee.status}</Badge>
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
}
