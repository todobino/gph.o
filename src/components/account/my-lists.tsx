
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Loader2, Unplug } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firestore";
import type { List as ListType, Subscription } from "@/types/subscriber";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

interface EnrichedSubscription extends Subscription {
    listName: string;
}

export function MyLists() {
    const user = useUser();
    const { toast } = useToast();
    const [subscriptions, setSubscriptions] = useState<EnrichedSubscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [unsubscribing, setUnsubscribing] = useState<string | null>(null);

    const fetchSubscriptions = async (userId: string) => {
        setLoading(true);
        try {
            // 1. Get user's subscriptions
            const subsQuery = query(collection(db, "subscriptions"), where("subscriberId", "==", userId), where("status", "==", "subscribed"));
            const subsSnap = await getDocs(subsQuery);
            const userSubscriptions = subsSnap.docs.map(d => d.data() as Subscription);

            if (userSubscriptions.length === 0) {
                 setSubscriptions([]);
                 setLoading(false);
                 return;
            }

            // 2. Get list details for those subscriptions
            const listIds = userSubscriptions.map(s => s.listId);
            const listsQuery = query(collection(db, "lists"), where("id", "in", listIds));
            const listsSnap = await getDocs(listsQuery);
            const listsMap = new Map(listsSnap.docs.map(d => [d.id, d.data() as ListType]));

            // 3. Enrich subscriptions with list names
            const enriched = userSubscriptions.map(sub => ({
                ...sub,
                listName: listsMap.get(sub.listId)?.name || 'Unknown List'
            }));

            setSubscriptions(enriched);

        } catch (error) {
            console.error("Error fetching subscriptions:", error);
             toast({
                title: "Error",
                description: "Could not fetch your mailing lists.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (user) {
           fetchSubscriptions(user.uid);
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleUnsubscribe = async (subscriptionId: string) => {
        if (!user) return;
        setUnsubscribing(subscriptionId);
        try {
            const batch = writeBatch(db);
            const now = new Date();

            const subRef = doc(db, "subscriptions", subscriptionId);
            batch.update(subRef, {
                status: "unsubscribed",
                unsubscribedAt: now,
                lastChangedAt: now,
                reason: "user"
            });
            
            await batch.commit();

            toast({
                title: "Unsubscribed",
                description: "You have been successfully removed from the list.",
            });
            
            // Refresh the list client-side
            setSubscriptions(prev => prev.filter(s => s.id !== subscriptionId));

        } catch (error) {
             console.error("Error unsubscribing:", error);
             toast({
                title: "Error",
                description: "Could not unsubscribe. Please try again.",
                variant: "destructive",
            });
        } finally {
            setUnsubscribing(null);
        }
    };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800/50 p-3 rounded-lg">
                <List className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="flex-grow">
                <CardTitle>My Lists</CardTitle>
                <CardDescription>
                Manage your mailing list subscriptions.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
             <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        ) : subscriptions.length > 0 ? (
            subscriptions.map((sub) => (
                 <div key={sub.id} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                    <span className="font-medium text-sm">{sub.listName}</span>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleUnsubscribe(sub.id)}
                        disabled={unsubscribing === sub.id}
                    >
                        {unsubscribing === sub.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Unplug className="h-4 w-4 mr-2" />
                                Unsubscribe
                            </>
                        )}
                    </Button>
                </div>
            ))
        ) : (
            <p className="text-sm text-muted-foreground text-center py-4 border-dashed border rounded-lg">You are not subscribed to any lists.</p>
        )}
      </CardContent>
    </Card>
  );
}
