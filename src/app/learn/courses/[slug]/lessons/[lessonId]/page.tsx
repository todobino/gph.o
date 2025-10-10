'use client';
import { useEffect, useRef } from "react";
import { trackProgress } from "@/services/lms";
import { Button } from "@/components/ui/button";

export default function LessonPage({ params }: { params: { slug: string; lessonId: string } }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  useEffect(() => {
    const onUnload = () => {
      const t = Math.floor(videoRef.current?.currentTime ?? 0);
      trackProgress({ courseSlug: params.slug, lessonId: params.lessonId, positionSeconds: t, completed: false });
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [params.slug, params.lessonId]);

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
        <video ref={videoRef} controls className="w-full h-full" src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => trackProgress({ courseSlug: params.slug, lessonId: params.lessonId, positionSeconds: 0, completed: true })}
        >
          Mark Complete
        </Button>
        <Button>Next Lesson →</Button>
      </div>
       <div>
        <h1 className="text-2xl font-bold font-heading mt-6 mb-2">Lesson Title</h1>
        <p className="text-muted-foreground">This is a placeholder for the lesson description. You can add markdown content here to provide details, resources, and links related to the video lesson.</p>
      </div>
    </div>
  );
}
