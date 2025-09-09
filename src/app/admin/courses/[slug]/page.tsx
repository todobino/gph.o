

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useIsAdmin } from '@/hooks/useUser';
import { getDoc, doc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import type { Course, Cohort } from '@/types/course';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight, FileText, Plus, Users, BadgeDollarSign, Tv, CheckCircle, Pencil, GraduationCap } from 'lucide-react';
import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EditCourseDetailsDialog } from '@/components/admin/edit-course-dialog';
import { AddCohortDialog } from '@/components/admin/add-cohort-dialog';
import Image from 'next/image';

function CourseSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-9 w-32" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="md:col-span-2">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    );
}

export default function EditCoursePage() {
    const params = useParams();
    const slug = params.slug as string;
    const isAdmin = useIsAdmin();

    const [course, setCourse] = useState<Course | null>(null);
    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddCohortDialogOpen, setIsAddCohortDialogOpen] = useState(false);

    const cohortColumns = [
        {
            accessorKey: 'name',
            header: 'Cohort Name',
            cell: ({ row }: { row: any }) => (
                <Link href={`/admin/courses/${slug}/${row.original.id}`} className="font-medium hover:underline">
                    {row.original.name}
                </Link>
            )
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }: { row: any }) => (
                <Badge variant={row.original.status === 'published' ? 'default' : 'secondary'} className="capitalize">{row.original.status}</Badge>
            )
        },
        {
            accessorKey: 'seatsConfirmed',
            header: 'Confirmed Seats',
        },
         {
            accessorKey: 'seatsTotal',
            header: 'Total Seats',
        },
        // Add actions column later
    ];

    const fetchCourseAndCohorts = async () => {
        setLoading(true);
        try {
            const courseQuery = query(collection(db, "courses"), where("slug", "==", slug));
            const courseSnapshot = await getDocs(courseQuery);

            if (courseSnapshot.empty) {
                setError("Course not found.");
                setCourse(null);
            } else {
                const courseDoc = courseSnapshot.docs[0];
                const courseData = { id: courseDoc.id, ...courseDoc.data() } as Course;
                setCourse(courseData);
                
                if (courseData.type === 'live') {
                    await fetchCohorts(courseDoc.id);
                }
            }
        } catch (err) {
            console.error("Error fetching course:", err);
            setError("Failed to fetch course data.");
        } finally {
            setLoading(false);
        }
    };
    
    const fetchCohorts = async (courseId: string) => {
        const cohortsRef = collection(db, "courses", courseId, "cohorts");
        const cohortsSnapshot = await getDocs(query(cohortsRef, orderBy("number", "desc")));
        const cohortsData = cohortsSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Cohort));
        setCohorts(cohortsData);
    };


    useEffect(() => {
        if (isAdmin && slug) {
            fetchCourseAndCohorts();
        }
    }, [isAdmin, slug]);


    if (loading || isAdmin === undefined) {
        return <CourseSkeleton />;
    }
    
    if (!isAdmin) {
        return <p className="text-destructive">You do not have permission to view this page.</p>;
    }

    if (error) {
        return <p className="text-destructive">{error}</p>;
    }

    if (!course) {
        return <p>Course could not be loaded.</p>;
    }

    const formatCurrency = (cents: number | undefined | null) => {
        if (typeof cents !== 'number') return 'N/A';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: course.currency || 'USD' }).format(cents / 100);
    }

    return (
        <div className="space-y-6">
             {course && <EditCourseDetailsDialog isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} course={course} onCourseUpdated={fetchCourseAndCohorts} />}
             {course && <AddCohortDialog isOpen={isAddCohortDialogOpen} onOpenChange={setIsAddCohortDialogOpen} course={course} cohorts={cohorts} onCohortAdded={() => fetchCohorts(course.id)} />}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-bold font-heading break-words">
                   {course.title}
                </h1>
                <Button variant="outline" asChild>
                    <Link href={`/courses/${course.slug}`} target="_blank">
                        Go to public page <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Left Sidebar */}
                <aside className="md:col-span-1 space-y-6 sticky top-24">
                     <Card className="group relative">
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            onClick={() => setIsEditDialogOpen(true)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                         <CardHeader className="p-0">
                            <div className="relative aspect-video">
                                <Image
                                    src={course.heroImageUrl || "https://picsum.photos/seed/course-placeholder/600/400"}
                                    alt={course.title}
                                    fill
                                    className="object-cover rounded-t-lg"
                                    data-ai-hint="course image"
                                />
                                <div className="absolute top-4 left-4 bg-primary p-3 rounded-lg">
                                    <GraduationCap className="h-6 w-6 text-primary-foreground" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                             <div>
                                <p className="text-sm text-foreground">
                                    {course.shortDescription || <span className="text-muted-foreground italic">No description provided.</span>}
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Type</span>
                                    <Badge variant={course.type === 'live' ? 'default' : 'secondary'} className="capitalize">{course.type}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Seat Number</span>
                                    <span>{course.defaultSeatCapacity || 'N/A'}</span>
                                </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Sessions</span>
                                    <span>{course.sessionCount || 'N/A'}</span>
                                </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Session Length</span>
                                    <span>{course.hoursPerSession ? `${course.hoursPerSession} hours` : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Price</span>
                                    <span>{formatCurrency(course.priceCents)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Format</span>
                                    <span className="capitalize">{course.format || 'N/A'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {/* Main Content */}
                <main className="md:col-span-2 space-y-6">
                    {course.type === 'live' && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <CardTitle>Manage Cohorts</CardTitle>
                                <Button size="sm" onClick={() => setIsAddCohortDialogOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Cohort
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <PostsDataTable columns={cohortColumns} data={cohorts} searchColumnId="name" />
                            </CardContent>
                        </Card>
                    )}

                    {course.type === 'self-paced' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage Modules</CardTitle>
                                    <CardDescription>
                                    Create and organize modules and lessons for this self-paced course.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center text-muted-foreground py-8">
                                    Module management UI will be here (coming soon).
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>

        </div>
    )
}
