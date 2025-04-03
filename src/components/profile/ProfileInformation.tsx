import { useState, useEffect } from "react";
import { User } from "@/contexts/auth-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { toast as sonnerToast } from "sonner";

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
  const [formData, setFormData] = useState({
    displayName: profile.displayName,
    bio: profile.bio,
    location: profile.location,
    website: profile.website,
    github: profile.github,
    twitter: profile.twitter,
  });

  // Update form data when profile changes
  useEffect(() => {
    setFormData({
      displayName: profile.displayName,
      bio: profile.bio,
      location: profile.location,
      website: profile.website,
      github: profile.github,
      twitter: profile.twitter,
    });
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      console.log("Updating profile with form data:", formData);

      // Create an updates object with the form data
      const updates: Partial<User> = {
        ...formData,
        photoURL: profile.photoURL,
        role: profile.role,
        theme: profile.theme,
        emailNotifications: profile.emailNotifications,
        pushNotifications: profile.pushNotifications,
      };

      // Update auth context (which will update database via updateUser function)
      const updatedUser = await updateUser(updates);

      if (updatedUser) {
        // Update local state with the returned user data
        setProfile(updatedUser);
        sonnerToast.success("Profile updated", {
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      sonnerToast.error("Update failed", {
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
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

      // Update auth context (which will update database)
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
          <Label htmlFor="displayName">Full Name</Label>
          <Input
            id="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={4}
            value={formData.bio}
            onChange={handleInputChange}
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
              value={formData.website}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={formData.github}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
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
