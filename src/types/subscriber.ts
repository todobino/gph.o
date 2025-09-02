
import { Timestamp } from "firebase/firestore";

export type SubscriberStatus =
  "active" | "unconfirmed" | "unsubscribed" | "bounced" | "complained" | "suppressed";

export interface Subscriber {
  id: string; // email
  email: string;
  displayName?: string;
  status: SubscriberStatus;
  loginUserId?: string;
  source?: "ui" | "import" | "api" | "webhook";
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  confirmedAt?: Date | Timestamp;
  gdprConsent?: { consented: boolean; at?: Date | Timestamp; ip?: string };
  mergeFields?: Record<string,string>;
  listIds?: string[]; // denorm (optional)
}

export interface List {
  id: string; // slug
  slug: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  subscriberCount: number;
  tags?: string[];
  subscriberIds?: string[]; // denorm (optional)
}

export type SubscriptionStatus = "subscribed" | "unsubscribed" | "pending";

export interface Subscription {
  id: string; // `${subscriberId}_${listId}`
  subscriberId: string;
  listId: string;
  status: SubscriptionStatus;
  channel: "email";
  subscribedAt?: Date | Timestamp;
  unsubscribedAt?: Date | Timestamp;
  lastChangedAt: Date | Timestamp;
  reason?: "user" | "admin" | "bounce" | "complaint" | "api";
  doubleOptIn?: { required: boolean; token?: string; sentAt?: Date | Timestamp; confirmedAt?: Date | Timestamp };
}
