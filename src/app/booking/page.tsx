
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookingPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center">Book Now</h1>
      <p className="text-center text-muted-foreground">
        Schedule a consultation or book a service.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Booking Options</CardTitle>
          <CardDescription>
            Select the service you're interested in booking. (Placeholder)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
                <h3 className="font-semibold">Consultation Call</h3>
                <p className="text-sm text-muted-foreground">30-minute introductory call.</p>
            </div>
            <Button disabled>Book Call</Button>
          </div>
           <div className="flex justify-between items-center p-4 border rounded-lg">
             <div>
                <h3 className="font-semibold">Workshop Booking</h3>
                <p className="text-sm text-muted-foreground">Inquire about workshop availability.</p>
            </div>
            <Button variant="secondary" asChild>
                <Link href="/contact">Inquire</Link>
            </Button>
          </div>
           <p className="text-xs text-center text-muted-foreground mt-6">
                Actual booking functionality coming soon.
           </p>
        </CardContent>
      </Card>
    </div>
  );
}
