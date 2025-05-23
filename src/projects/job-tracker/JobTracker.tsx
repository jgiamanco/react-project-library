import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const JobTracker: React.FC = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-50 flex justify-center items-center">
      <Card className="max-w-5xl w-full shadow-lg">
        <CardHeader>
          <CardTitle>Job Application Tracker</CardTitle>
          <CardDescription>Track your job applications and progress with ease.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p className="mb-4">Kanban board, statistics dashboard, and reminders coming soon.</p>
            <Button disabled>Add New Application</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobTracker;