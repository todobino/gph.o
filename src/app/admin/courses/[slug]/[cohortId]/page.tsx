
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useIsAdmin } from '@/hooks/useUser';
import { getDoc, doc, collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import type { Course, Cohort, CohortSession } from '@/types/course';
import type { Attendee } from '@/types/attendee';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Edit, Mail, Plus, User, Users } from 'lucide-react';
import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

function CohortSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-9 w-48" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-9 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="md:col-span-2">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    );
}

const attendeeColumns = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }: { row: any }) => (
            <Badge variant={row.original.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize">{row.original.status}</Badge>
        )
    },
    {
        id: 'actions',
        cell: ({ row }: { row: any }) => (
            <Button variant="outline" size="sm" disabled>
                <Edit className="mr-2 h-3 w-3" />
                Manage
            </Button>
        ),
    }
];

export default function EditCohortPage() {
    const params = useParams();
    const slug = params.slug as string;
    const cohortId = params.cohortId as string;
    const isAdmin = useIsAdmin();

    const [course, setCourse] = useState<Course | null>(null);
    const [cohort, setCohort] = useState<Cohort | null>(null);
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCohortDetails = async () => {
        setLoading(true);
        try {
            // 1. Get Course ID from slug
            const courseQuery = query(collection(db, "courses"), where("slug", "==", slug));
            const courseSnapshot = await getDocs(courseQuery);

            if (courseSnapshot.empty) {
                throw new Error("Course not found.");
            }
            const courseDoc = courseSnapshot.docs[0];
            const courseData = { id: courseDoc.id, ...courseDoc.data() } as Course;
            setCourse(courseData);

            // 2. Get Cohort from subcollection
            const cohortRef = doc(db, "courses", courseDoc.id, "cohorts", cohortId);
            const cohortSnap = await getDoc(cohortRef);

            if (!cohortSnap.exists()) {
                throw new Error("Cohort not found.");
            }
            setCohort({ id: cohortSnap.id, ...cohortSnap.data() } as Cohort);

            // 3. Fetch attendees (placeholder - implement when data is available)
            // const attendeesQuery = query(collection(db, "courses", courseDoc.id, "cohorts", cohortId, "attendees"));
            // const attendeesSnapshot = await getDocs(attendeesQuery);
            // const attendeesData = attendeesSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Attendee));
            // setAttendees(attendeesData);

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

    const formatSessionTime = (timestamp: Timestamp) => {
        if (!timestamp) return 'N/A';
        return format(timestamp.toDate(), 'h:mm a');
    };

    const formatSessionDate = (timestamp: Timestamp) => {
        if (!timestamp) return 'N/A';
        return format(timestamp.toDate(), 'EEEE, MMMM d, yyyy');
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

    return (
        <div className="space-y-6">
            <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/courses/${slug}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to {course.title}
                </Link>
            </Button>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-bold font-heading break-words">
                   {cohort.name}
                </h1>
                <div className="flex gap-2">
                    <Button variant="outline" disabled>
                        <Mail className="mr-2 h-4 w-4" />
                        Email Attendees
                    </Button>
                     <Button variant="outline" disabled>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Cohort
                    </Button>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Left Sidebar */}
                <aside className="md:col-span-1 space-y-6 sticky top-24">
                     <Card>
                        <CardHeader>
                            <CardTitle>Cohort Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Status</span>
                                <Badge variant={cohort.status === 'published' ? 'default' : 'secondary'} className="capitalize">{cohort.status}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Confirmed</span>
                                <span>{cohort.seatsConfirmed} / {cohort.seatsTotal}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Held</span>
                                <span>{cohort.seatsHeld}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Remaining</span>
                                <span>{cohort.seatsRemaining}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cohort.sessions.map((session, index) => (
                                <div key={index}>
                                    <p className="font-semibold">{session.label || `Session ${index + 1}`}</p>
                                    <div className="text-sm text-muted-foreground flex flex-col gap-1 mt-1">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatSessionDate(session.startAt)}</span>
                                        </div>
                                         <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{formatSessionTime(session.startAt)} - {formatSessionTime(session.endAt)}</span>
                                        </div>
                                    </div>
                                    {index < cohort.sessions.length -1 && <Separator className="mt-4" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </aside>

                {/* Main Content */}
                <main className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5" />
                                <CardTitle>Attendees</CardTitle>
                            </div>
                            <Button size="sm" disabled>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Attendee
                            </Button>
                        </CardHeader>
                        <CardContent>
                           <PostsDataTable columns={attendeeColumns} data={attendees} searchColumnId="name" />
                           {attendees.length === 0 && (
                             <p className="text-center text-muted-foreground py-8">No attendees enrolled yet.</p>
                           )}
                        </CardContent>
                    </Card>
                </main>
            </div>

        </div>
    )
}
