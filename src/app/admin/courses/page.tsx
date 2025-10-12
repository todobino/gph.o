

'use client';

import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import type { Course } from '@/types/course';
import { useIsAdmin } from '@/hooks/useUser';
import { Skeleton } from '@/components/ui/skeleton';
import { AddCourseDialog } from '@/components/admin/add-course-dialog';
import { useRouter } from 'next/navigation';

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isAdmin = useIsAdmin();

  const courseColumns = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }: { row: any }) => (
         <Link href={`/admin/courses/${row.original.slug}`} className="font-medium hover:underline" onClick={(e) => e.stopPropagation()}>
            {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'active',
      header: 'Status',
       cell: ({ row }: { row: any }) => (row.original.active ? 'Active' : 'Draft'),
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
    },
  ];

  useEffect(() => {
    if (isAdmin) {
      const fetchCourses = async () => {
        try {
          const coursesSnapshot = await getDocs(query(collection(db, 'courses')));
          const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Course);
          setCourses(coursesData);
        } catch (error) {
          console.error("Error fetching courses:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    } else if (isAdmin === false) {
      setLoading(false);
    }
  }, [isAdmin]);

  if (loading) {
     return (
       <Card>
          <CardHeader>
              <Skeleton className="h-8 w-1/4" />
          </CardHeader>
          <CardContent>
              <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
              </div>
          </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold font-heading mb-8">Manage Courses</h1>
      <AddCourseDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Courses</CardTitle>
            <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PostsDataTable 
            columns={courseColumns} 
            data={courses} 
            searchColumnId="title"
            onRowClick={(row) => router.push(`/admin/courses/${row.original.slug}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
