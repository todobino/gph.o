'use client';
import { useEffect, useState } from 'react';
import type { Course } from '@/types/course';
import { listCatalog } from '@/services/lms';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

function CatalogSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                    <Skeleton className="aspect-video bg-muted mb-3" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    )
}


export default function CatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
        try {
            const items = await listCatalog();
            setCourses(items);
        } catch (error) {
            console.error("Failed to fetch catalog:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchCourses();
  }, []);

  if (isLoading) return <CatalogSkeleton />;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {courses.map(c => (
        <Link key={c.id} href={`/learn/courses/${c.slug}`} className="block border rounded-lg p-4 hover:bg-accent group">
          <div className="aspect-video bg-muted mb-3 rounded-md overflow-hidden">
             {c.heroImageUrl && <img src={c.heroImageUrl} alt={c.title} className="w-full h-full object-cover" />}
          </div>
          <div className="font-medium group-hover:text-primary">{c.title}</div>
          <div className="text-sm text-muted-foreground">{c.shortDescription}</div>
        </Link>
      ))}
    </div>
  );
}
