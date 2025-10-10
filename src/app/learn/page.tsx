
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyLearningPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-heading">My Learning</h1>
        <p className="text-muted-foreground mt-2">
          Your central hub for all enrolled courses and progress.
        </p>
      </div>

      {/* This will later be a list of enrolled courses */}
      <div className="p-8 border-2 border-dashed rounded-lg text-center">
        <h2 className="text-xl font-semibold">No Courses Yet</h2>
        <p className="text-muted-foreground mt-2 mb-4">
            You are not enrolled in any courses. Browse the catalog to get started.
        </p>
        <Button asChild>
            <Link href="/learn/catalog">
                Browse Catalog
            </Link>
        </Button>
      </div>
    </div>
  );
}
