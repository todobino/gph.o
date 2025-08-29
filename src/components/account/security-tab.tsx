
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export function SecurityTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-green-100 dark:bg-green-800/50 p-3 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="flex-grow">
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                Manage your password and 2FA settings.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold">Change Password</h3>
            <p className="text-sm text-muted-foreground">
              It's a good idea to use a strong password.
            </p>
          </div>
          <Button disabled>Change Password</Button>
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account.
            </p>
          </div>
          <Button variant="secondary" disabled>Enable 2FA</Button>
        </div>
         <p className="text-xs text-center text-muted-foreground mt-6">
            Security functionality is under development.
         </p>
      </CardContent>
    </Card>
  );
}
