
import { useState } from "react";
import { User } from "@/contexts/auth-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast as sonnerToast } from "sonner";

interface AccountSettingsProps {
  profile: User;
  setProfile: React.Dispatch<React.SetStateAction<User>>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

export const AccountSettings = ({ profile, setProfile, updateUser }: AccountSettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      console.log("Updating theme preference:", profile.theme);
      
      // Update theme preference in user profile
      await updateUser({
        theme: profile.theme,
      });

      sonnerToast.success("Settings updated", {
        description: "Your account settings have been updated successfully."
      });
    } catch (error) {
      console.error("Account settings update error:", error);
      sonnerToast.error("Update failed", {
        description: "Failed to update account settings. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleAccountUpdate} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Theme Preferences</h3>
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={profile.theme}
            onValueChange={(value) =>
              setProfile({
                ...profile,
                theme: value as "light" | "dark" | "system",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Password</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="current-password">
              Current Password
            </Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">
              Confirm Password
            </Label>
            <Input id="confirm-password" type="password" />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
