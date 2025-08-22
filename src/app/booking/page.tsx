
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl font-bold font-heading">Book Now</h1>
                <p className="text-muted-foreground mt-4">
                    Schedule a consultation or book a service.
                </p>
            </div>

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
                        <h3 className="font-semibold font-heading">Consultation Call</h3>
                        <p className="text-sm text-muted-foreground">30-minute introductory call.</p>
                    </div>
                    <Button disabled>Book Call</Button>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                        <h3 className="font-semibold font-heading">Workshop Booking</h3>
                        <p className="text-sm text-muted-foreground">Inquire about workshop availability.</p>
                    </div>
                    <Button variant="secondary" asChild>
                        <Link href="/contact">Inquire</Link>
                    </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground pt-4">
                        Actual booking functionality coming soon.
                </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
