
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <div>
        <h1 className="text-4xl font-bold font-heading mb-8">Admin Panel</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Welcome to the admin dashboard. Here you can manage your site's content and settings.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
