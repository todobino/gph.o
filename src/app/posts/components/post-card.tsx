
import Link from 'next/link';
import type { Post } from '@/services/posts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  const postUrl = `/posts/${post.slug}`;

  return (
    <Card className={cn("flex flex-col h-full hover:shadow-lg transition-shadow duration-300", className)}>
      <CardHeader>
        <CardTitle>
          <Link href={postUrl} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" /> 
            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {post.content.substring(0, 150)}...
        </div>
         {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <Tag className="h-3 w-3 text-muted-foreground" />
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" asChild>
                <Link href={`/posts?tag=${tag}`}>{tag}</Link>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
