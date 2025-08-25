

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
        <CardContent className="space-y-4">
          {upcomingCoursesData.map((course) => {
            const seatsAvailable = course.seatsTotal - course.seatsFilled;
            const isFull = seatsAvailable <= 0;

            return (
              <div key={course.id} className="p-4 border rounded-lg space-y-4">
                {/* Top Row: Title and Action Button */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{course.name} - {course.cohort}</h3>
                  </div>
                  <div>
                    {isFull ? (
                      <Button onClick={() => handleWaitlistClick(course.id)} className="w-full md:w-auto">Join Waitlist</Button>
                    ) : (
                      <Button asChild className="w-full md:w-auto">
                        <a href={course.purchaseUrl} target="_blank" rel="noopener noreferrer">Buy a Seat</a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Details */}
                <div className="flex justify-between items-end text-sm">
                  <div>
                    <p className="text-muted-foreground flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4"/> {course.time}
                    </p>
                    <ul className="space-y-1">
                      {course.dates.map((date) => (
                        <li key={date} className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground"/>
                          <span>{date}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground flex items-center justify-end gap-2">
                      <Users className="h-4 w-4"/> 
                      {isFull ? (
                        <Badge variant="destructive" className="text-sm">Full</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-sm">{seatsAvailable} of {course.seatsTotal} seats open</Badge>
                      )}
                    </div>
                  </div>
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
