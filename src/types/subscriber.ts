import { Timestamp } from "firebase/firestore";

export interface Subscriber {
  email: string;
  displayName?: string;
  listIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  firstSubscribedAt?: Timestamp;
  sources?: string[];
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
}

export type FormType = "subscribe";
export type AssignMode = "fixed" | "choose";

export interface Form {
  name: string;
  slug: string;
  type: FormType;
  isPublic: boolean;
  requireLogin: boolean;
  assignMode: AssignMode;
  targetListIds: string[];
  allowFirstTimeFlag: boolean;
  submitLabel?: string;
  successMessage?: string;
redirectUrl?: string;
  styleVariant?: "compact" | "full";
  createdBy: string; // uid
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
