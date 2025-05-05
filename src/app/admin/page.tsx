import { checkIfAdmin, getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListPlus, Edit, CalendarDays, Users } from "lucide-react";
import { redirect } from "next/navigation";

// This forces SSR and disables static generation
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const isAdmin = await checkIfAdmin(user);

  if (!isAdmin) {
    redirect('/login');
  }

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Manage Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Manage Posts
            </CardTitle>
            <CardDescription>Create, edit, or delete posts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/posts/new"><ListPlus className="w-4 h-4 mr-1" /> New Post</a>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <a href="/admin/posts">View All Posts</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manage Events (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Manage Events
            </CardTitle>
            <CardDescription>Add, update, or remove events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <ListPlus className="w-4 h-4 mr-1" /> New Event
              </Button>
              <Button variant="secondary" size="sm" disabled>
                View All Events
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Event management coming soon.</p>
          </CardContent>
        </Card>

        {/* Manage Subscribers (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Manage Subscribers
            </CardTitle>
            <CardDescription>View and manage email list subscribers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" size="sm" disabled>
              View Subscribers
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Subscriber management coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
