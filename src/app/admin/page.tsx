import { checkIfAdmin, getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListPlus, Edit, CalendarDays, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';


async function checkAuth() {
  const user = await getCurrentUser();
  const isAdmin = await checkIfAdmin();

  if (!user || !isAdmin) {
    redirect('/login');
  }
  return true;
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const isAdmin = await checkIfAdmin();

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
          Loading...
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
          Loading...
      </div>
    }>
        <AdminDashboard />
    </Suspense>
  );
}

function AdminDashboard() {
  return (<div className="space-y-8">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Manage Posts Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-primary" />
                Manage Posts {/* Renamed from Blog Posts */}
            </CardTitle>
            <CardDescription>Create, edit, or delete posts.</CardDescription> {/* Renamed from blog posts */}
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>                  
                    <a href="/admin/posts/new"><ListPlus className="w-4 h-4 mr-1" /> New Post</a> {/* Link might need adjustment depending on admin structure */}
                </Button>
                 <Button variant="secondary" size="sm" asChild>
                    <a href="/admin/posts">View All Posts</a> {/* Link might need adjustment depending on admin structure */}
                </Button>
            </div>
          </CardContent>
        </Card>

         {/* Manage Events Card (Placeholder) */}
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
                 <Button variant="outline" size="sm" disabled> {/* Placeholder */}
                    <ListPlus className="w-4 h-4 mr-1" /> New Event
                 </Button>
                 <Button variant="secondary" size="sm" disabled> {/* Placeholder */}
                     View All Events
                 </Button>
             </div>
             <p className="text-xs text-muted-foreground mt-2">Event management coming soon.</p>
          </CardContent>
        </Card>

         {/* Manage Subscribers Card (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                 <Users className="w-5 h-5 text-primary" />
                 Manage Subscribers
            </CardTitle>
            <CardDescription>View and manage email list subscribers.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="secondary" size="sm" disabled> {/* Placeholder */}
                View Subscribers
             </Button>
             <p className="text-xs text-muted-foreground mt-2">Subscriber management coming soon.</p>
          </CardContent>
        </Card>
      </div>

       {/* Other potential dashboard sections */}
       {/* <section>
         <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
         {/* Display recent form submissions, new posts etc. * /}
         <p className="text-muted-foreground">No recent activity to display.</p>
       </section> */}
    </div>
  )
}
