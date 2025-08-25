
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
    purchaseUrl: "https://book.stripe.com/4gw7v991obDr1Nu007",
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
    purchaseUrl: "https://book.stripe.com/4gw7v991obDr1Nu007",
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
              <div key={course.id} className="p-4 border rounded-lg space-y-4">
                {/* Top Row: Title and Action Button */}
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{course.name} - {course.cohort}</h3>
                     <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                      <Users className="h-4 w-4"/> 
                      {isFull ? (
                        <Badge variant="destructive">Full</Badge>
                      ) : (
                        <Badge variant="secondary">{seatsAvailable} of {course.seatsTotal} seats open</Badge>
                      )}
                    </div>
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

                {/* Bottom Row: Dates as Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                    {course.dates.map((date) => (
                        <div key={date} className="flex flex-col items-center justify-center p-3 rounded-lg bg-secondary text-secondary-foreground text-center">
                            <span className="font-semibold text-sm">{date.split(',')[0]},</span>
                            <span className="font-semibold text-sm">{date.split(',')[1]}</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3" />
                                <span>{course.time}</span>
                            </div>
                        </div>
                    ))}
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
