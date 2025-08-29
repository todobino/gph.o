
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPostsPage() {
  return (
    <div>
        <h1 className="text-4xl font-bold font-heading mb-8">Manage Posts</h1>
        <Card>
            <CardHeader>
                <CardTitle>All Posts</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Post management interface coming soon.</p>
            </CardContent>
        </Card>
    </div>
  );
}
