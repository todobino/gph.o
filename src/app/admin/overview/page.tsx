
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UpcomingCourses } from '@/components/courses/upcoming-courses';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { GraduationCap, LineChart as LineChartIcon, UserMinus, Users } from 'lucide-react';

const chartData = [
  { date: '2024-07-15', visitors: 230 },
  { date: '2024-07-16', visitors: 255 },
  { date: '2024-07-17', visitors: 290 },
  { date: '2024-07-18', visitors: 260 },
  { date: '2024-07-19', visitors: 310 },
  { date: '2024-07-20', visitors: 350 },
  { date: '2024-07-21', visitors: 330 },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--primary))',
  },
};

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold font-heading">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Course Signups</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+152</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriber Churn</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2%</div>
            <p className="text-xs text-muted-foreground">Down 0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Site Traffic Chart */}
       <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
             <LineChartIcon className="h-6 w-6 text-primary" />
             <CardTitle>Site Traffic</CardTitle>
          </div>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <LineChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
               <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={6}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="visitors"
                type="monotone"
                stroke="var(--color-visitors)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>


      {/* Upcoming Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Courses</CardTitle>
          <CardDescription>Manage schedule and view enrollment for upcoming live courses.</CardDescription>
        </CardHeader>
        <CardContent>
          <UpcomingCourses />
        </CardContent>
      </Card>
    </div>
  );
}
