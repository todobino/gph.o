
import type { Timestamp } from 'firebase/firestore';

export interface Attendee {
  id: string; // Document ID, matches user ID
  name: string;
  email: string;
  status: "held" | "confirmed" | "cancelled" | "waitlisted";
  addedAt: Timestamp;
  confirmedAt?: Timestamp;
  paymentId?: string; // e.g., Stripe charge ID
  notes?: string;
}
