
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function LeadingTechnicalChangePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-secondary p-8 md:p-12 rounded-lg shadow-sm text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Leading Technical Change
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-4">
          No upcoming LTC classes at this time. Be on the lookout for announcements of the next live cohort.
        </p>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Learn more about the course and download the outline below!
        </p>
         {/* Placeholder button for downloading outline */}
         <Button size="lg" disabled> {/* Disabled until functionality is added */}
             <Download className="mr-2 h-5 w-5" />
             Download Course Outline (Coming Soon)
         </Button>
      </div>

      {/* Optional: Add more sections below if needed */}
      {/*
      <div className="mt-12">
        <h2 className="text-3xl font-semibold mb-6 text-center">Course Details</h2>
        {/* Add more details about the course here */}
      {/*
      </div>
      */}
    </div>
  );
}
