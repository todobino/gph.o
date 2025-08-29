
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminCoursesPage() {
  return (
    <div>
        <h1 className="text-4xl font-bold font-heading mb-8">Manage Courses</h1>
        <Card>
            <CardHeader>
                <CardTitle>All Courses</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Course management interface coming soon.</p>
            </CardContent>
        </Card>
    </div>
  );
}
