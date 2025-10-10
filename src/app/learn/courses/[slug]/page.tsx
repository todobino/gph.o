'use client';
import { getCourseBySlug, enroll } from '@/services/lms';
import { useUser } from '@/hooks/useUser';
import type { Course } from '@/types/course';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { GraduationCap, Info } from 'lucide-react';
import Image from 'next/image';

export default function CourseOverviewPage() {
    const params = useParams();
    const router = useRouter();
    const user = useUser();
    const slug = params.slug as string;
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);

    useEffect(() => {
        if (slug) {
            getCourseBySlug(slug).then(courseData => {
                setCourse(courseData);
                setLoading(false);
            });
        }
    }, [slug]);

    const handleEnroll = async () => {
        if (!user) {
            router.push(`/login?next=/learn/courses/${slug}`);
            return;
        }
        if (!course) return;

        setIsEnrolling(true);
        try {
            const result = await enroll({ courseId: course.id });
            if (result.ok) {
                toast({
                    title: "Enrolled!",
                    description: `You have successfully enrolled in ${course.title}.`,
                });
                // Potentially redirect to the first lesson
                 router.push(`/learn/courses/${slug}/lessons/l1`);
            } else {
                 throw new Error("Enrollment failed");
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to enroll in the course. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsEnrolling(false);
        }
    }

    if (loading) {
        return (
             <div className="space-y-6">
                <Skeleton className="w-full h-48" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
        )
    }

    if (!course) {
        return <div>Course not found.</div>
    }

    return (
        <div className="space-y-8">
            {course.heroImageUrl && (
                 <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image src={course.heroImageUrl} alt={course.title} fill className="object-cover" />
                 </div>
            )}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-md">
                        <GraduationCap className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold font-heading">{course.title}</h1>
                </div>
                <p className="text-lg text-muted-foreground">{course.shortDescription}</p>
            </div>
            
            <Button onClick={handleEnroll} disabled={isEnrolling} size="lg">
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
            </Button>

             <div className="prose dark:prose-invert max-w-none">
                <h2 id="about">About this course</h2>
                <p>This is placeholder content for the course description. You can use markdown to structure this content.</p>
                <ul>
                    <li>Learn key concepts.</li>
                    <li>Apply them in practical exercises.</li>
                    <li>Master the topic.</li>
                </ul>
            </div>

        </div>
    )
}
