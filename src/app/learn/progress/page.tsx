
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-heading">My Progress</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress across all your courses.
        </p>
      </div>
      <div className="p-8 border-2 border-dashed rounded-lg text-center">
        <h2 className="text-xl font-semibold">No Progress to Show</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          Start a course to see your progress here.
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
