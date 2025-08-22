
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminTab() {
  const router = useRouter();
  
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
        <CardDescription>
          Access administrative features and site management tools.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
                <h3 className="font-semibold">Manage Posts</h3>
                <p className="text-sm text-muted-foreground">Create, edit, and delete blog posts.</p>
            </div>
            <Button asChild>
                <Link href="/admin/posts">Go to Posts</Link>
            </Button>
        </div>
        <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
                <h3 className="font-semibold">Manage Users</h3>
                <p className="text-sm text-muted-foreground">View and manage user roles.</p>
            </div>
            <Button variant="secondary" disabled>Manage Users</Button>
        </div>
        <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
                <h3 className="font-semibold">Site Analytics</h3>
                <p className="text-sm text-muted-foreground">View traffic and engagement metrics.</p>
            </div>
            <Button variant="secondary" disabled>View Analytics</Button>
        </div>
         <p className="text-xs text-center text-muted-foreground mt-6">
            Additional admin tools coming soon.
         </p>
      </CardContent>
    </Card>
  );
}
