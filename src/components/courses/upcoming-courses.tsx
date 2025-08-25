

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaitlistDialog } from "./waitlist-dialog";
import { CalendarDays } from 'lucide-react';

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
            <h2 className="text-3xl font-bold font-heading">Upcoming</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingCoursesData.map((course) => {
            const seatsAvailable = course.seatsTotal - course.seatsFilled;
            const isFull = seatsAvailable <= 0;

            return (
              <Card key={course.id} className="shadow-md border-primary/20 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-bold font-heading">{course.name} - {course.cohort}</CardTitle>
                  <CardDescription>{course.time}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                   <div>
                      {isFull ? (
                        <Badge variant="destructive" className="text-sm">Full</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-sm">{seatsAvailable} of {course.seatsTotal} seats open</Badge>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        Course Dates
                      </h4>
                      <ul className="space-y-1 text-sm text-foreground/90 pl-6">
                          {course.dates.map((date) => (
                              <li key={date} className="list-disc list-outside">{date}</li>
                          ))}
                      </ul>
                    </div>
                </CardContent>
                <CardFooter>
                   {isFull ? (
                        <Button onClick={() => handleWaitlistClick(course.id)} className="w-full">Join Waitlist</Button>
                      ) : (
                        <Button asChild className="w-full">
                          <a href={course.purchaseUrl} target="_blank" rel="noopener noreferrer">Buy a Seat</a>
                        </Button>
                      )}
                </CardFooter>
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
