
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaitlistDialog } from "./waitlist-dialog";
import { Clock, Users, CalendarClock, Video, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const upcomingCoursesData = [
  {
    id: "ltc13",
    name: "Leading Technical Change",
    cohort: "LTC 13",
    seatsTotal: 6,
    seatsFilled: 2,
    purchaseUrl: "https://book.stripe.com/4gw7v991obDr1Nu007",
    dates: [
      { day: "Monday", date: "Oct 6" },
      { day: "Tuesday", date: "Oct 7" },
      { day: "No Class", date: "Oct 8", isNoClass: true },
      { day: "Thursday", date: "Oct 9" },
      { day: "Friday", date: "Oct 10" },
    ],
    time: "1-3pm",
    duration: "4 sessions / 8 hours",
    format: "Zoom",
  },
  {
    id: "ltc14",
    name: "Leading Technical Change",
    cohort: "LTC 14",
    seatsTotal: 6,
    seatsFilled: 6,
    purchaseUrl: "https://book.stripe.com/4gw7v991obDr1Nu007",
    dates: [
        { day: "Monday", date: "Nov 17" },
        { day: "Tuesday", date: "Nov 18" },
        { day: "No Class", date: "Nov 19", isNoClass: true },
        { day: "Thursday", date: "Nov 20" },
        { day: "Friday", date: "Nov 21" },
    ],
    time: "11-1pm",
    duration: "4 sessions / 8 hours",
    format: "Zoom",
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
            <div className="flex-shrink-0 bg-blue-200 dark:bg-blue-800/50 p-2 rounded-full">
                <CalendarClock className="h-6 w-6 text-blue-600 dark:text-blue-300" />
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
                     <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4"/>
                            {isFull ? (
                                <Badge variant="secondary">Full</Badge>
                            ) : (
                                <Badge variant="secondary">{seatsAvailable} seats left</Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            <span>{course.format}</span>
                        </div>
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
                    {course.dates.map((d) => (
                        <div key={d.date} className={cn(
                            "flex flex-col items-start justify-center p-3 rounded-lg bg-secondary text-secondary-foreground text-left",
                             d.isNoClass && "bg-gray-800 text-white"
                        )}>
                           {d.isNoClass ? (
                                <span className="font-semibold mx-auto">No Class</span>
                           ) : (
                            <>
                                <span className="text-sm font-normal">{d.day}</span>
                                <span className="text-lg font-bold text-foreground -mt-1">{d.date}</span>
                                <span className="text-xs">{course.time}</span>
                            </>
                           )}
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
