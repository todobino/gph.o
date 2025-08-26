
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaitlistDialog } from "./waitlist-dialog";
import { Clock, Users, CalendarClock } from 'lucide-react';

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
    time: "1-3pm"
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
    time: "1-3pm"
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
      <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-accent text-primary rounded-full p-2">
                <CalendarClock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold font-heading">
            Upcoming Classes
            </h2>
        </div>
        <div className="space-y-6">
          {upcomingCoursesData.map((course) => {
            const seatsAvailable = course.seatsTotal - course.seatsFilled;
            const isFull = seatsAvailable <= 0;

            return (
              <div key={course.id} className="p-4 border rounded-lg space-y-4 shadow-md hover:border-primary transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{course.name} - {course.cohort}</h3>
                     <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                      <Users className="h-4 w-4"/> 
                      {isFull ? (
                        <Badge variant="secondary">Full</Badge>
                      ) : (
                        <Badge variant="secondary">{seatsAvailable} of {course.seatsTotal} seats left</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    {isFull ? (
                      <Button onClick={() => handleWaitlistClick(course.id)} className="w-full md:w-auto" variant="secondary">Join Waitlist</Button>
                    ) : (
                      <Button asChild className="w-full md:w-auto">
                        <a href={course.purchaseUrl} target="_blank" rel="noopener noreferrer">Buy a Seat</a>
                      </Button>
                    )}
                  </div>
                </div>

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
