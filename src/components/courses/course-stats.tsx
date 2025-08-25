
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Tv } from 'lucide-react';
import Image from 'next/image';

interface CourseStatsProps {
    title: string;
    description: string;
    imageUrl: string;
    imageHint: string;
    seats: number;
    duration: string;
    format: string;
}

export function CourseStats({ title, description, imageUrl, imageHint, seats, duration, format }: CourseStatsProps) {
    return (
        <Card>
             <CardHeader className="p-0">
                <div className="relative aspect-video">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover rounded-t-lg"
                        data-ai-hint={imageHint}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <CardTitle className="font-heading text-xl">{title}</CardTitle>
                <CardDescription className="text-sm">{description}</CardDescription>
                <div className="space-y-3 text-sm pt-2">
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
                </div>
            </CardContent>
        </Card>
    );
}
