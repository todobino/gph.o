
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, Clock, Tv, GraduationCap, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    // This is a placeholder URL. In a real application, you might pass this as a prop.
    const purchaseUrl = "https://book.stripe.com/4gw7v991obDr1Nu007";

    return (
        <Card className="shadow-lg">
             <CardHeader className="p-0">
                <div className="relative aspect-video">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover rounded-t-lg"
                        data-ai-hint={imageHint}
                    />
                     <div className="absolute top-4 left-4 bg-primary p-3 rounded-full">
                        <GraduationCap className="h-6 w-6 text-primary-foreground" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <CardTitle className="font-heading text-xl">{title}</CardTitle>
                    </div>
                </div>
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
            <CardFooter className="p-6 pt-0">
                 <Button asChild className="w-full">
                    <Link href={purchaseUrl} target="_blank" rel="noopener noreferrer">
                        Grab a Seat <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
