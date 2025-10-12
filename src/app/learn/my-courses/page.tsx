
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyLearningPage() {
  // Placeholder data for enrolled courses
  const enrolledCourses = [
    { name: "Leading Technical Change", slug: "leading-technical-change" },
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
            <div key={course.slug} className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold font-heading mb-2">{course.name}</h2>
              <p className="text-muted-foreground text-sm mb-4">You are enrolled. Continue learning!</p>
              <Button asChild>
                <Link href={`/learn/my-courses/${course.slug}/lessons/l1`}>
                  Go to Course
                </Link>
              </Button>
            </div>
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
