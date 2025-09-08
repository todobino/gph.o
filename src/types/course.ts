
import type { Timestamp } from 'firebase/firestore';

export interface Course {
  id: string; // Document ID
  type: "live" | "self-paced";
  title: string;
  slug: string;
  shortDescription?: string;
  heroImageUrl?: string;
  bullets?: string[];
  format?: "remote" | "in-person" | "hybrid";
  defaultSeatCapacity?: number;
  sessionCount?: number;
  hoursPerSession?: number;
  totalHours?: number;
  priceCents?: number;
  currency?: "USD";
  active: boolean;
  sortOrder?: number;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  nextCohortId?: string;
  nextCohortStartAt?: Timestamp;
  nextCohortSeatsRemaining?: number;
  nextCohortStatus?: "draft" | "published" | "waitlist" | "soldout" | "completed" | "cancelled";
}

export interface CohortSession {
    startAt: Timestamp;
    endAt: Timestamp;
    label: string;
}

export interface Cohort {
    id: string; // Document ID
    name: string;
    code: string;
    status: "draft" | "published" | "waitlist" | "soldout" | "completed" | "cancelled";
    seatsTotal: number;
    seatsHeld: number;
    seatsConfirmed: number;
    seatsRemaining: number;
    priceCentsOverride?: number | null;
    registrationUrl?: string | null;
    instructors?: string[];
    notes?: string;
    sessions: CohortSession[];
    zoomJoinUrl?: string | null;
    recordingsDriveFolder?: string | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
