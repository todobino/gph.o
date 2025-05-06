
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewPostPage() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold">Create New Post</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/posts">Cancel</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Post Editor</CardTitle>
          <CardDescription>
            Write your new post content here. (Functionality coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for a form or editor */}
          <div className="border border-dashed border-muted-foreground rounded-md min-h-[300px] flex items-center justify-center text-muted-foreground">
            Post Editor Area - Placeholder
          </div>
          <div className="flex justify-end mt-4">
            <Button disabled>Save Post</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
