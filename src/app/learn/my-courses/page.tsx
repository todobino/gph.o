
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { BookCheck } from "lucide-react";

export default function MyLearningPage() {
  // Placeholder data for enrolled courses
  const enrolledCourses = [
    { 
      name: "Leading Technical Change", 
      slug: "leading-technical-change",
      imageUrl: "https://picsum.photos/seed/courses-ltc/600/400",
      progress: 25,
      completedModules: 1,
      totalModules: 4,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-heading">My Courses</h1>
        <p className="text-muted-foreground mt-2">
          Your central hub for all enrolled courses and progress.
        </p>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(course => (
             <Card key={course.slug} className="overflow-hidden flex flex-col group">
                <Link href={`/learn/my-courses/${course.slug}/lessons/l1`}>
                    <div className="relative aspect-video">
                        <Image 
                            src={course.imageUrl}
                            alt={course.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                        />
                    </div>
                </Link>
                <CardContent className="p-4 flex flex-col flex-grow">
                    <h2 className="text-lg font-semibold font-heading mb-2 flex-grow">{course.name}</h2>
                    
                    <div className="space-y-2 my-4">
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <BookCheck className="h-4 w-4" />
                            <span>{course.completedModules} of {course.totalModules} modules complete</span>
                        </div>
                    </div>

                    <Button asChild className="w-full mt-auto">
                        <Link href={`/learn/my-courses/${course.slug}/lessons/l1`}>
                        Continue Course
                        </Link>
                    </Button>
                </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 border-2 border-dashed rounded-lg text-center">
          <h2 className="text-xl font-semibold">No Courses Yet</h2>
          <p className="text-muted-foreground mt-2 mb-4">
              You are not enrolled in any courses. Browse the catalog to get started.
          </p>
          <Button asChild>
              <Link href="/learn/browse">
                  Browse Catalog
              </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
