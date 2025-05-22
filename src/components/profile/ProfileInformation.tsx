
import { useState, useEffect } from "react";
import { User } from "@/contexts/auth-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { toast as sonnerToast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProfileInformationProps {
  profile: User;
  setProfile: (profile: User) => void;
  updateUser: (updates: Partial<User>) => Promise<User>;
  isUpdating: boolean;
}

const ProfileInformation = ({
  profile,
  setProfile,
  updateUser,
  isUpdating,
}: ProfileInformationProps) => {
  const [formData, setFormData] = useState<Partial<User>>({
    displayName: profile.displayName || "",
    bio: profile.bio || "",
    location: profile.location || "",
    website: profile.website || "",
    github: profile.github || "",
    twitter: profile.twitter || "",
    role: profile.role || "Developer",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when profile changes
  useEffect(() => {
    setFormData({
      displayName: profile.displayName || "",
      bio: profile.bio || "",
      location: profile.location || "",
      website: profile.website || "",
      github: profile.github || "",
      twitter: profile.twitter || "",
      role: profile.role || "Developer",
    });
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isUpdating) return;

    setIsSubmitting(true);
    try {
      const updatedUser = await updateUser(formData);
      if (updatedUser) {
        setProfile(updatedUser);
        sonnerToast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      sonnerToast.error("Failed to update profile", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = async (newAvatarUrl: string) => {
    if (isSubmitting || isUpdating) return; // Prevent multiple submissions

    try {
      setIsSubmitting(true);

      // Update local state immediately for a responsive UI
      setProfile({
        ...profile,
        photoURL: newAvatarUrl,
      });

      console.log("Updating avatar URL:", newAvatarUrl);

      // Update auth context (which will update database)
      const updatedUser = await updateUser({ photoURL: newAvatarUrl });

      if (updatedUser) {
        setProfile(updatedUser);
        sonnerToast.success("Avatar updated", {
          description: "Your profile picture has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Avatar update error:", error);
      sonnerToast.error("Update failed", {
        description: "Failed to update profile picture. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-4">
        <AvatarUpload
          currentAvatar={profile.photoURL || ""}
          onAvatarChange={handleAvatarChange}
          name={profile.displayName}
          isLoading={isSubmitting || isUpdating}
        />
        <div>
          <p className="text-sm font-medium">Profile Picture</p>
          <p className="text-sm text-muted-foreground">
            Click on your avatar to change it
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            placeholder="Your name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="Your role"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Your location"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="Your website"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            name="github"
            value={formData.github}
            onChange={handleInputChange}
            placeholder="Your GitHub username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter</Label>
          <Input
            id="twitter"
            name="twitter"
            value={formData.twitter}
            onChange={handleInputChange}
            placeholder="Your Twitter handle"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || isUpdating}>
          {isSubmitting || isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileInformation;
