
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { GraduationCap, CheckCircle } from "lucide-react";
import { Badge } from "../ui/badge";

// Placeholder data - replace with actual user course data from Firestore
const enrolledCourses = [
    { name: "Leading Technical Change (Cohort 13)", href: "/courses/leading-technical-change" },
];

const completedCourses = [
    { name: "TDD Workshop (May 2023)", status: "Completed" },
];

export function MyCourses() {
  return (
    <Card>
      <CardHeader>
         <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-800/50 p-3 rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="flex-grow">
                <CardTitle>My Courses</CardTitle>
                <CardDescription>
                    Manage your enrolled and completed courses.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Currently Enrolled</h3>
            {enrolledCourses.length > 0 ? (
                <div className="space-y-3">
                {enrolledCourses.map((course) => (
                    <div key={course.name} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <span className="font-medium text-sm">{course.name}</span>
                         <Button asChild variant="outline" size="sm">
                            <Link href={course.href}>View Course</Link>
                        </Button>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4 border-dashed border rounded-lg">You are not currently enrolled in any courses.</p>
            )}
        </div>
         <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Course History</h3>
             {completedCourses.length > 0 ? (
                <div className="space-y-3">
                {completedCourses.map((course) => (
                    <div key={course.name} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <span className="font-medium text-sm text-muted-foreground">{course.name}</span>
                        <Badge variant="secondary" className="text-green-700 bg-green-100 border-green-200">
                           <CheckCircle className="h-3 w-3 mr-1.5" />
                           {course.status}
                        </Badge>
                    </div>
                ))}
                </div>
            ) : (
                 <p className="text-sm text-muted-foreground text-center py-4 border-dashed border rounded-lg">No completed courses yet.</p>
            )}
        </div>

        <p className="text-xs text-center text-muted-foreground pt-4">
            Course enrollment functionality is a work in progress.
        </p>
      </CardContent>
    </Card>
  );
}
