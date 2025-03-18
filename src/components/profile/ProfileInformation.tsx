import { useState } from "react";
import { User } from "@/contexts/auth-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { toast as sonnerToast } from "sonner";
import { updateUserProfile } from "@/services/user-service";

interface ProfileInformationProps {
  profile: User;
  setProfile: React.Dispatch<React.SetStateAction<User>>;
  updateUser: (updates: Partial<User>) => Promise<User | void>;
}

export const ProfileInformation = ({
  profile,
  setProfile,
  updateUser,
}: ProfileInformationProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      console.log("Updating profile with data:", profile);

      // First update the database
      await updateUserProfile(profile.email, {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        github: profile.github,
        twitter: profile.twitter,
        role: profile.role,
        theme: profile.theme,
        emailNotifications: profile.emailNotifications,
        pushNotifications: profile.pushNotifications,
      });

      // Then update auth context
      await updateUser({
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        github: profile.github,
        twitter: profile.twitter,
        role: profile.role,
        theme: profile.theme,
        emailNotifications: profile.emailNotifications,
        pushNotifications: profile.pushNotifications,
      });

      sonnerToast.success("Profile updated", {
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      sonnerToast.error("Update failed", {
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (newAvatarUrl: string) => {
    try {
      setIsLoading(true);

      // Update local state
      setProfile({
        ...profile,
        photoURL: newAvatarUrl,
      });

      console.log("Updating avatar URL:", newAvatarUrl);

      // Update database first
      await updateUserProfile(profile.email, {
        ...profile,
        photoURL: newAvatarUrl,
      });

      // Then update auth context
      await updateUser({ photoURL: newAvatarUrl });

      sonnerToast.success("Avatar updated", {
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error("Avatar update error:", error);
      sonnerToast.error("Update failed", {
        description: "Failed to update profile picture. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleProfileUpdate} className="space-y-6">
      <div className="flex items-center space-x-4">
        <AvatarUpload
          currentAvatar={profile.photoURL || ""}
          onAvatarChange={handleAvatarChange}
          name={profile.displayName}
        />
        <div>
          <p className="text-sm font-medium">Profile Picture</p>
          <p className="text-sm text-muted-foreground">
            Click on your avatar to change it
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={profile.displayName}
            onChange={(e) =>
              setProfile({ ...profile, displayName: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={profile.location}
            onChange={(e) =>
              setProfile({ ...profile, location: e.target.value })
            }
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={4}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Social Links</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={profile.website}
              onChange={(e) =>
                setProfile({ ...profile, website: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={profile.github}
              onChange={(e) =>
                setProfile({ ...profile, github: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={profile.twitter}
              onChange={(e) =>
                setProfile({ ...profile, twitter: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
