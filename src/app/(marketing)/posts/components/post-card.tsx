
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/services/posts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Video, Headphones, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: Post;
}

function getPostIcon(post: Post) {
  if (post.tags.includes('video')) {
    return <Video className="h-4 w-4 mr-2" />;
  }
  if (post.tags.includes('audio')) {
    return <Headphones className="h-4 w-4 mr-2" />;
  }
  return <FileText className="h-4 w-4 mr-2" />;
}

export function PostCard({ post }: PostCardProps) {
  const postUrl = `/posts/${post.slug}`;
  const firstParagraph = post.content.split('\n\n')[0];

  // Check for a markdown image in the content
  const imageMatch = post.content.match(/!\[.*\]\((.*)\)/);
  const imageUrl = imageMatch ? imageMatch[1] : null;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
       {imageUrl && (
         <Link href={postUrl} className="block aspect-video relative overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
         </Link>
       )}
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl leading-tight">
           <Link href={postUrl} className="hover:text-primary transition-colors">
            {post.title}
           </Link>
        </CardTitle>
        <div className="text-sm text-muted-foreground pt-2">
            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="mx-2">&middot;</span>
            <span>By {post.author}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {firstParagraph}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <div className="flex flex-wrap gap-2">
           {post.tags.slice(0, 2).map(tag => (
             <Badge key={tag} variant="secondary">{tag}</Badge>
           ))}
        </div>
         <Button asChild variant="link" size="sm" className="pr-0">
             <Link href={postUrl}>
               Read More <ArrowRight className="ml-1 h-4 w-4" />
             </Link>
         </Button>
      </CardFooter>
    </Card>
  );
}
