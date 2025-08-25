
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaitlistDialog } from "./waitlist-dialog";

const upcomingCoursesData = [
  {
    id: "ltc13",
    name: "Leading Technical Change",
    cohort: "LTC 13",
    seatsTotal: 6,
    seatsFilled: 2,
    purchaseUrl: "https://buy.stripe.com/some-link",
    dates: [
      "Monday, Oct 6",
      "Tuesday, Oct 7",
      "Wednesday, Oct 8",
      "Thursday, Oct 9",
      "Friday, Oct 10"
    ],
    time: "1-3pm Eastern Time"
  },
  {
    id: "ltc14",
    name: "Leading Technical Change",
    cohort: "LTC 14",
    seatsTotal: 6,
    seatsFilled: 6,
    purchaseUrl: "https://buy.stripe.com/some-other-link",
    dates: [
      "Monday, Nov 3",
      "Tuesday, Nov 4",
      "Wednesday, Nov 5",
      "Thursday, Nov 6",
      "Friday, Nov 7"
    ],
    time: "1-3pm Eastern Time"
  }
];

export function UpcomingCourses() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const handleWaitlistClick = (courseId: string) => {
    setSelectedCourse(courseId);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-bold font-heading">Upcoming Live Courses</h2>
        </div>
        <div className="grid gap-6">
          {upcomingCoursesData.map((course) => {
            const seatsAvailable = course.seatsTotal - course.seatsFilled;
            const isFull = seatsAvailable <= 0;

            return (
              <Card key={course.id} className="shadow-lg border-2 border-primary/20">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <CardTitle className="text-2xl font-bold font-heading">{course.name} - {course.cohort}</CardTitle>
                      <CardDescription>{course.time}</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      {isFull ? (
                        <Badge variant="destructive" className="text-sm">Full</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-sm">{seatsAvailable} of {course.seatsTotal} seats open</Badge>
                      )}
                      {isFull ? (
                        <Button onClick={() => handleWaitlistClick(course.id)}>Join Waitlist</Button>
                      ) : (
                        <Button asChild>
                          <a href={course.purchaseUrl} target="_blank" rel="noopener noreferrer">Buy a Seat</a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
                    {course.dates.map((date) => (
                      <li key={date} className="bg-accent text-accent-foreground p-3 rounded-md">
                        <p className="font-semibold">{date.split(',')[0]}</p>
                        <p className="text-sm">{date.split(',').slice(1).join(',').trim()}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <WaitlistDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        courseId={selectedCourse}
      />
    </>
  );
}
