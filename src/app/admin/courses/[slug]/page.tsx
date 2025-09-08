
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useIsAdmin } from '@/hooks/useUser';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import type { Course, Cohort } from '@/types/course';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

function CourseSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-9 w-32" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                     <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
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
    
    useEffect(() => {
        if (!isAdmin || !slug) return;

        const fetchCourse = async () => {
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
                    
                    // If it's a live course, fetch its cohorts
                    if (courseData.type === 'live') {
                        const cohortsRef = collection(db, "courses", courseDoc.id, "cohorts");
                        const cohortsSnapshot = await getDocs(cohortsRef);
                        const cohortsData = cohortsSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Cohort));
                        setCohorts(cohortsData);
                    }
                }
            } catch (err) {
                console.error("Error fetching course:", err);
                setError("Failed to fetch course data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [isAdmin, slug]);


    if (loading || isAdmin === undefined) {
        return <CourseSkeleton />;
    }
    
    if (!isAdmin) {
         // This should ideally be handled by the layout, but as a fallback
        return <p className="text-destructive">You do not have permission to view this page.</p>;
    }

    if (error) {
        return <p className="text-destructive">{error}</p>;
    }

    if (!course) {
        return <p>Course could not be loaded.</p>;
    }


    return (
        <div className="space-y-6">
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

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Course Details</CardTitle>
                        <CardDescription>
                            Modify the general settings for this course.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground py-8">
                            Course editing form will be here.
                        </p>
                    </CardContent>
                </Card>

                {course.type === 'live' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Cohorts ({cohorts.length})</CardTitle>
                                <CardDescription>
                                View, create, and edit cohorts for this live course.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground py-8">
                                Cohort management UI will be here.
                            </p>
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
            </div>

        </div>
    )
}
