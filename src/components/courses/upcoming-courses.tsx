
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaitlistDialog } from "./waitlist-dialog";
import { Clock, Users, CalendarClock, Video } from 'lucide-react';
import { collection, query, where, orderBy, getDocs, Timestamp, collectionGroup, Query, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import type { Cohort, Course } from '@/types/course';
import { format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';


const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    published: 'secondary',
    waitlist: 'default',
    soldout: 'destructive',
    default: 'outline'
};

function formatSessionDate(timestamp: Timestamp) {
    if (!timestamp) return { day: '', date: '', time: '' };
    const d = timestamp.toDate();
    return {
        day: format(d, 'EEEE'),
        date: format(d, 'MMM d'),
        time: `${format(d, 'h:mm a')} - ${format(new Date(d.getTime() + 2 * 60 * 60 * 1000), 'h:mm a')}`
    }
}

function CohortSkeleton() {
    return (
        <div className="p-4 border rounded-lg space-y-4 shadow-md">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-56" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-10 w-28" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        </div>
    );
}


export function UpcomingCourses({ courseSlug }: { courseSlug?: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohorts = async () => {
        setLoading(true);
        try {
            let cohortsQuery: Query<DocumentData>;

            if (courseSlug) {
                // First, get the course ID from the slug
                const courseQuery = query(collection(db, 'courses'), where('slug', '==', courseSlug), where('active', '==', true));
                const courseSnapshot = await getDocs(courseQuery);
                
                if (courseSnapshot.empty) {
                    console.warn(`No active course found with slug: ${courseSlug}`);
                    setCohorts([]);
                    setLoading(false);
                    return;
                }
                const courseId = courseSnapshot.docs[0].id;
                
                // Then, query for cohorts within that specific course
                cohortsQuery = query(
                    collection(db, 'courses', courseId, 'cohorts'), 
                    where('status', 'in', ['published', 'waitlist', 'soldout'])
                );

            } else {
                // If no slug, fetch from the collection group as before
                cohortsQuery = query(
                    collectionGroup(db, 'cohorts'), 
                    where('status', 'in', ['published', 'waitlist', 'soldout'])
                );
            }
            
            const querySnapshot = await getDocs(cohortsQuery);
            const fetchedCohorts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cohort));
            
            // Sort by the start date of the first session client-side
            fetchedCohorts.sort((a, b) => {
                const aStart = a.sessions?.[0]?.startAt?.toDate()?.getTime() || 0;
                const bStart = b.sessions?.[0]?.startAt?.toDate()?.getTime() || 0;
                return aStart - bStart;
            });

            setCohorts(fetchedCohorts);
        } catch (error) {
            console.error("Error fetching cohorts:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchCohorts();
  }, [courseSlug]);

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
          {loading && (
            <>
                <CohortSkeleton />
                <CohortSkeleton />
            </>
          )}

          {!loading && cohorts.length === 0 && (
            <div className="text-center py-16 border-dashed border-2 rounded-lg">
                <h2 className="text-2xl font-semibold font-heading">No Upcoming Courses</h2>
                <p className="mt-2 text-muted-foreground">
                    Check back soon for new course announcements!
                </p>
            </div>
          )}

          {!loading && cohorts.map((cohort) => {
            const seatsRemaining = cohort.seatsTotal - cohort.seatsConfirmed;
            const isFull = seatsRemaining <= 0;
            const statusLabel = isFull ? 'Full' : `${seatsRemaining} left`;
            const badgeVariant = (isFull) ? 'default' : 'secondary';
            const cohortStatusLabel = cohort.status.charAt(0).toUpperCase() + cohort.status.slice(1);

            return (
              <div key={cohort.id} className="p-4 border rounded-lg space-y-4 shadow-md hover:border-primary transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{cohort.name}</h3>
                     <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4"/>
                            <span>{cohort.seatsTotal} Seats</span>
                            <Badge variant={badgeVariant}>{statusLabel}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{cohort.sessions.length} sessions</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            <span>Remote</span>
                        </div>
                         {cohort.status !== 'soldout' && !isFull && (
                            <Badge variant={statusVariantMap[cohort.status] || statusVariantMap.default} className="capitalize">{cohortStatusLabel}</Badge>
                         )}
                    </div>
                  </div>
                  <div>
                    {cohort.status === 'soldout' || cohort.status === 'waitlist' || isFull ? (
                      <Button onClick={() => handleWaitlistClick(cohort.id)} className="w-full md:w-auto" variant="secondary">Join Waitlist</Button>
                    ) : (
                      <Button asChild className="w-full md:w-auto">
                        <a href={cohort.checkoutLink || cohort.registrationUrl || '#'} target="_blank" rel="noopener noreferrer">Grab a Seat</a>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                    {cohort.sessions.map((s, index) => {
                        const { day, date, time } = formatSessionDate(s.startAt);
                        return (
                            <div key={index} className="flex flex-col items-start justify-center p-3 rounded-lg text-left bg-background border border-border">
                                <span className="text-sm font-normal">{day}</span>
                                <span className="text-lg font-bold text-foreground -mt-1">{date}</span>
                                <span className="text-xs">{time}</span>
                            </div>
                        )
                    })}
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
