

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaitlistDialog } from "./waitlist-dialog";
import { CalendarDays, Clock, Users } from 'lucide-react';

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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-heading">Upcoming</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {upcomingCoursesData.map((course) => {
            const seatsAvailable = course.seatsTotal - course.seatsFilled;
            const isFull = seatsAvailable <= 0;

            return (
              <div key={course.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 border rounded-lg">
                <div className="md:col-span-1">
                    <h3 className="font-semibold">{course.name} - {course.cohort}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4"/> {course.time}
                    </p>
                </div>
                <div className="md:col-span-1 text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4"/> 
                     {isFull ? (
                        <Badge variant="destructive" className="text-sm">Full</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-sm">{seatsAvailable} of {course.seatsTotal} seats open</Badge>
                      )}
                </div>
                <div className="md:col-span-1">
                     <ul className="space-y-1 text-sm">
                        {course.dates.map((date) => (
                            <li key={date} className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-muted-foreground"/>
                                <span>{date}</span>
                            </li>
                        ))}
                      </ul>
                </div>
                 <div className="md:col-span-1 md:text-right">
                    {isFull ? (
                        <Button onClick={() => handleWaitlistClick(course.id)} className="w-full md:w-auto">Join Waitlist</Button>
                      ) : (
                        <Button asChild className="w-full md:w-auto">
                          <a href={course.purchaseUrl} target="_blank" rel="noopener noreferrer">Buy a Seat</a>
                        </Button>
                      )}
                 </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <WaitlistDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        courseId={selectedCourse}
      />
    </>
  );
}
