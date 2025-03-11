
import { useState } from "react";
import { User } from "@/contexts/auth-types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast as sonnerToast } from "sonner";

interface NotificationSettingsProps {
  profile: User;
  setProfile: React.Dispatch<React.SetStateAction<User>>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

export const NotificationSettings = ({ profile, setProfile, updateUser }: NotificationSettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleNotificationsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      console.log("Updating notification preferences:", {
        email: profile.emailNotifications,
        push: profile.pushNotifications
      });
      
      // Update notification preferences
      await updateUser({
        emailNotifications: profile.emailNotifications,
        pushNotifications: profile.pushNotifications,
      });

      sonnerToast.success("Notifications updated", {
        description: "Your notification preferences have been updated successfully."
      });
    } catch (error) {
      console.error("Notification settings update error:", error);
      sonnerToast.error("Update failed", {
        description: "Failed to update notification settings. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleNotificationsUpdate} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email.
            </p>
          </div>
          <Switch
            checked={profile.emailNotifications}
            onCheckedChange={(checked) =>
              setProfile({
                ...profile,
                emailNotifications: checked,
              })
            }
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Push Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Receive push notifications in your browser.
            </p>
          </div>
          <Switch
            checked={profile.pushNotifications}
            onCheckedChange={(checked) =>
              setProfile({ ...profile, pushNotifications: checked })
            }
          />
        </div>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
