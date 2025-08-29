
import { PostsDataTable } from '@/components/admin/posts-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
];

const placeholderCourses = [
    { id: 'ltc', title: 'Leading Technical Change', status: 'Published', enrollment: '12/20' },
    // Add more placeholder courses as needed
];

export default function AdminCoursesPage() {
  return (
    <div>
        <h1 className="text-4xl font-bold font-heading mb-8">Manage Courses</h1>
        <Card>
            <CardHeader>
                <CardTitle>All Courses</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Course management interface is under development. The table below is a placeholder.</p>
                <PostsDataTable columns={courseColumns} data={placeholderCourses} />
            </CardContent>
        </Card>
    </div>
  );
}
