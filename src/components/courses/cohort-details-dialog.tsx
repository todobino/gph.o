
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Clock, Tv, Users, X } from "lucide-react";
import type { Course, Cohort } from "@/types/course";
import { format } from "date-fns";
import Link from "next/link";
import { Separator } from "../ui/separator";

interface CohortDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cohort: (Cohort & { course: Course }) | null;
}

export function CohortDetailsDialog({ isOpen, onOpenChange, cohort }: CohortDetailsDialogProps) {
  if (!cohort) return null;

  const { course } = cohort;
  const seatsRemaining = cohort.seatsTotal - cohort.seatsConfirmed;
  const isFull = seatsRemaining <= 0;

  const formatSessionTime = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'h:mm a');
  };

  const formatSessionDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'E, MMM d, yyyy');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-start gap-4">
             <div>
                <DialogTitle className="text-2xl font-bold font-heading mb-1">{cohort.name}</DialogTitle>
                <DialogDescription>
                    Part of the <span className="font-semibold text-primary">{course.title}</span> course.
                </DialogDescription>
             </div>
             <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
            {/* Core Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span><span className="font-semibold text-foreground">{cohort.seatsTotal} seats</span> total</span>
                </div>
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span><span className="font-semibold text-foreground">{cohort.sessions.length} sessions</span></span>
                </div>
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span><span className="font-semibold text-foreground">{course.hoursPerSession || 2} hours</span> each</span>
                </div>
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <Tv className="h-4 w-4 text-primary" />
                    <span className="capitalize"><span className="font-semibold text-foreground">{course.format || 'Remote'}</span> format</span>
                </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>{course.shortDescription || "No course description available."}</p>
                 <p>This is a placeholder for a more detailed description of what this specific cohort will cover. It could include details about the instructor, special topics, or prerequisites.</p>
            </div>
            
            <Separator />
            
            {/* Schedule */}
            <div>
                <h3 className="font-semibold text-md mb-3 font-heading">Cohort Schedule</h3>
                <div className="space-y-2">
                    {cohort.sessions.map((session, index) => (
                        <div key={index} className="flex items-center gap-4 rounded-lg border p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-bold text-lg">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{formatSessionDate(session.startAt)}</p>
                                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                    <span>{formatSessionTime(session.startAt)} - {formatSessionTime(session.endAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4">
             <DialogClose asChild>
                <Button asChild variant="outline">
                    <Link href={`/learn/browse/${course.slug}`}>
                        View Full Course Page
                    </Link>
                </Button>
            </DialogClose>
            
            <div className="flex items-center gap-3">
                <Badge variant={isFull ? "destructive" : "secondary"} className="px-4 py-2">
                    {isFull ? "Sold Out" : `${seatsRemaining} Seats Left`}
                </Badge>
                {isFull ? (
                    <Button disabled>Join Waitlist (Coming Soon)</Button>
                ) : (
                    <Button asChild>
                        <Link href={cohort.checkoutLink || '#'}>
                            Grab a Seat <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
