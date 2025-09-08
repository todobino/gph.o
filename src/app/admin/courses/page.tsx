
'use client';

import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';

// Placeholder course data and columns
const courseColumns = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
  },
];

const placeholderCourses = [
    { id: 'ltc', title: 'Leading Technical Change', type: 'live', status: 'Published', tags: ['leadership', 'change management', 'teams'] },
    // In a real app, this data would be fetched from Firestore.
    // Example fetching logic would be placed in a useEffect hook here,
    // similar to other admin pages.
];

export default function AdminCoursesPage() {
  return (
    <div>
        <h1 className="text-4xl font-bold font-heading mb-8">Manage Courses</h1>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>All Courses</CardTitle>
                    <Button asChild>
                      <Link href="/admin/courses/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New
                      </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <PostsDataTable columns={courseColumns} data={placeholderCourses} searchColumnId="title" />
            </CardContent>
        </Card>
    </div>
  );
}
