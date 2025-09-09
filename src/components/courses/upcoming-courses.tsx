
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaitlistDialog } from "./waitlist-dialog";
import { Clock, Users, CalendarClock, Video, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// This data structure now reflects the more detailed schema.
// In a real app, this would be fetched from the /courses/{id}/cohorts subcollection.
const upcomingCohortsData = [
  {
    id: "ltc-13",
    courseName: "Leading Technical Change",
    cohortName: "LTC 13",
    status: "published",
    seatsTotal: 6,
    seatsConfirmed: 4,
    purchaseUrl: "https://book.stripe.com/4gw7v991obDr1Nu007",
    sessions: [
      { day: "Monday", date: "Oct 6", time: "1-3pm" },
      { day: "Tuesday", date: "Oct 7", time: "1-3pm" },
      { day: "Thursday", date: "Oct 9", time: "1-3pm" },
      { day: "Friday", date: "Oct 10", time: "1-3pm" },
    ],
    duration: "4 sessions / 8 hours",
    format: "Zoom",
  },
  {
    id: "ltc-14",
    courseName: "Leading Technical Change",
    cohortName: "LTC 14",
    status: "soldout",
    seatsTotal: 6,
    seatsConfirmed: 6,
    purchaseUrl: "https://book.stripe.com/4gw7v991obDr1Nu007",
     sessions: [
      { day: "Monday", date: "Nov 17", time: "11am-1pm" },
      { day: "Tuesday", date: "Nov 18", time: "11am-1pm" },
      { day: "Thursday", date: "Nov 20", time: "11am-1pm" },
      { day: "Friday", date: "Nov 21", time: "11am-1pm" },
    ],
    duration: "4 sessions / 8 hours",
    format: "Zoom",
  }
];

// A mapping of status to Badge variant for styling
const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    published: 'secondary',
    waitlist: 'default',
    soldout: 'destructive',
    default: 'outline'
};


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
            <div className="flex-shrink-0 bg-blue-200 dark:bg-blue-800/50 p-2 rounded-lg">
                <CalendarClock className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h2 className="text-2xl font-bold font-heading">
            Upcoming Classes
            </h2>
        </div>
        <div className="space-y-6">
          {upcomingCohortsData.map((cohort) => {
            const seatsRemaining = cohort.seatsTotal - cohort.seatsConfirmed;
            const isFull = seatsRemaining <= 0;
            const statusLabel = isFull ? 'Full' : `${seatsRemaining} left`;
            const badgeVariant = isFull ? 'default' : 'secondary';
            const cohortStatusLabel = cohort.status.charAt(0).toUpperCase() + cohort.status.slice(1);

            return (
              <div key={cohort.id} className="p-4 border rounded-lg space-y-4 shadow-md hover:border-primary transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{cohort.courseName} - {cohort.cohortName}</h3>
                     <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4"/>
                            <span>{cohort.seatsTotal} Seats</span>
                            <Badge variant={badgeVariant}>{statusLabel}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{cohort.duration}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            <span>{cohort.format}</span>
                        </div>
                         {cohort.status !== 'soldout' && (
                            <Badge variant={statusVariantMap[cohort.status] || statusVariantMap.default} className="capitalize">{cohortStatusLabel}</Badge>
                         )}
                    </div>
                  </div>
                  <div>
                    {cohort.status === 'soldout' || cohort.status === 'waitlist' ? (
                      <Button onClick={() => handleWaitlistClick(cohort.id)} className="w-full md:w-auto" variant="secondary">Join Waitlist</Button>
                    ) : (
                      <Button asChild className="w-full md:w-auto">
                        <a href={cohort.purchaseUrl} target="_blank" rel="noopener noreferrer">Grab a Seat</a>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                    {cohort.sessions.map((s, index) => (
                        <div key={index} className="flex flex-col items-start justify-center p-3 rounded-lg text-left bg-background border border-border">
                            <span className="text-sm font-normal">{s.day}</span>
                            <span className="text-lg font-bold text-foreground -mt-1">{s.date}</span>
                            <span className="text-xs">{s.time}</span>
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
