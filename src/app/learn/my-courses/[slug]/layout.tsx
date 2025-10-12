'use client';
import { getCourseBySlug } from "@/services/lms";
import { type Course } from "@/types/course";
import { BookOpen, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function CourseSidebarSkeleton() {
    return (
        <aside className="w-full md:w-1/4 lg:w-1/5 space-y-4">
             <Skeleton className="h-6 w-3/4" />
             <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
             </div>
        </aside>
    )
}


export default function CourseLayout({ children }: { children: ReactNode }) {
    const params = useParams();
    const pathname = usePathname();
    const slug = params.slug as string;
    const [course, setCourse] = useState<Course | null>(null);

    useEffect(() => {
        if (slug) {
            getCourseBySlug(slug).then(setCourse);
        }
    }, [slug])

    // Mocked modules and lessons
    const modules = [
        { id: 'm1', title: 'Introduction', lessons: [{ id: 'l1', title: 'Welcome to the Course'}, {id: 'l2', title: 'Course Objectives'}] },
        { id: 'm2', title: 'Core Concepts', lessons: [{ id: 'l3', title: 'Understanding Change'}, { id: 'l4', title: 'The Human Element'}] },
    ];

    if (!course) {
        return (
             <div className="flex flex-col md:flex-row gap-8">
                <CourseSidebarSkeleton />
                <main className="w-full md:w-3/4 lg:w-4/5">
                    <Skeleton className="h-96 w-full" />
                </main>
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4 lg:w-1/5">
                <div className="sticky top-24">
                    <h2 className="font-semibold text-lg mb-4">{course.title}</h2>
                    <nav className="space-y-4">
                        {modules.map(module => (
                            <div key={module.id}>
                                <h3 className="font-medium text-sm text-muted-foreground px-4 mb-2">{module.title}</h3>
                                <ul className="space-y-1">
                                    {module.lessons.map(lesson => {
                                        const lessonPath = `/learn/my-courses/${slug}/lessons/${lesson.id}`;
                                        const isActive = pathname === lessonPath;
                                        return (
                                            <li key={lesson.id}>
                                                <Link href={lessonPath} className={`flex items-center gap-3 p-2 rounded-md text-sm ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
                                                    <BookOpen className="h-4 w-4" />
                                                    <span className="flex-1">{lesson.title}</span>
                                                    {/* Add progress icon here later */}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>
            </aside>
            <main className="w-full md:w-3/4 lg:w-4/5">
                {children}
            </main>
        </div>
    );
}
