import type { Timestamp } from 'firebase/firestore';

export type AttendeeStatus = "pending" | "confirmed" | "cancelled" | "waitlisted";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "pending";

export interface Attendee {
  id: string; // Document ID
  userId?: string; // Firebase Auth User ID, if applicable
  
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;

  // Billing Info
  billingName?: string;
  billingEmail?: string;
  billingAddress?: string; // Could be a structured object later

  // Statuses
  status: AttendeeStatus; 
  paymentStatus: PaymentStatus;

  // Timestamps & Metadata
  addedAt: Timestamp;
  confirmedAt?: Timestamp;
  paymentId?: string; // e.g., Stripe charge ID
  notes?: string;
}
