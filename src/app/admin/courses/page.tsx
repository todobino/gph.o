
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
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'enrollment',
    header: 'Enrollment',
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
  },
];

const placeholderCourses = [
    { id: 'ltc', title: 'Leading Technical Change', status: 'Published', enrollment: '12/20', tags: ['leadership', 'change management', 'teams'] },
    // Add more placeholder courses as needed
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
                <PostsDataTable columns={courseColumns} data={placeholderCourses} />
            </CardContent>
        </Card>
    </div>
  );
}
