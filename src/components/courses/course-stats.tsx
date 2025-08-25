
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Calendar, Tv } from 'lucide-react';

interface CourseStatsProps {
    seats: number;
    duration: string;
    format: string;
}

export function CourseStats({ seats, duration, format }: CourseStatsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-heading">Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Users className="h-5 w-5 text-primary" />
                    <span><span className="font-semibold text-foreground">{seats} seats</span> per cohort</span>
                </div>
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    <span><span className="font-semibold text-foreground">{duration}</span> total</span>
                </div>
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <Tv className="h-5 w-5 text-primary" />
                    <span><span className="font-semibold text-foreground">{format}</span> format</span>
                </div>
            </CardContent>
        </Card>
    );
}
