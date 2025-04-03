import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/contexts/auth-types";
import ProfileInformation from "@/components/profile/ProfileInformation";
import { AccountSettings } from "@/components/profile/AccountSettings";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { getUserProfile, updateUserProfile } from "@/services/user-service";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, updateUser, isLoading: authLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get the tab from the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "profile");

  // User profile state
  const [profile, setProfile] = useState<User | null>(null);

  // Load user profile from database
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!authUser?.email) {
        if (!authLoading) {
          console.log("No user found in auth context, redirecting to sign in");
          toast.error("Authentication required");
          navigate("/signin", { replace: true });
        }
        return;
      }

      try {
        setIsLoading(true);
        console.log("Loading profile for user:", authUser.email);
        const dbProfile = await getUserProfile(authUser.email);

        if (dbProfile) {
          console.log("Profile loaded from database:", dbProfile);
          setProfile({
            ...dbProfile,
            ...authUser,
            displayName: dbProfile.displayName || authUser.displayName,
            photoURL: dbProfile.photoURL || authUser.photoURL || "",
            bio: dbProfile.bio || "Tell us about yourself...",
            location: dbProfile.location || authUser.location || "",
            website: dbProfile.website || "",
            github: dbProfile.github || "",
            twitter: dbProfile.twitter || "",
            role: dbProfile.role || "Developer",
            theme: dbProfile.theme || "system",
            emailNotifications: dbProfile.emailNotifications ?? true,
            pushNotifications: dbProfile.pushNotifications ?? false,
          });
        } else {
          console.log("No profile found in database, creating default profile");
          const defaultProfile: User = {
            ...authUser,
            bio: "Tell us about yourself...",
            website: "",
            github: "",
            twitter: "",
            role: "Developer",
            theme: "system" as const,
            emailNotifications: true,
            pushNotifications: false,
          };

          setProfile(defaultProfile);
          await updateUserProfile(authUser.email, defaultProfile);
          console.log("Default profile created in database");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        if (authUser) {
          console.log("Falling back to user data with defaults");
          setProfile({
            ...authUser,
            bio: authUser.bio || "Tell us about yourself...",
            website: authUser.website || "",
            github: authUser.github || "",
            twitter: authUser.twitter || "",
            role: authUser.role || "Developer",
            theme: authUser.theme || "system",
            emailNotifications: authUser.emailNotifications ?? true,
            pushNotifications: authUser.pushNotifications ?? false,
          });
        }
        toast.error("Error loading profile data", {
          description:
            "Using local profile data. Changes may not be saved to the server.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [authUser, authLoading, navigate]);

  // Handle profile updates
  const handleProfileUpdate = async (updates: Partial<User>): Promise<User> => {
    if (!authUser?.email || !profile) {
      throw new Error("No user or profile available");
    }

    setIsUpdating(true);
    try {
      // Only update the database if there are actual changes
      const hasChanges = Object.keys(updates).some(
        (key) => updates[key as keyof User] !== profile[key as keyof User]
      );

      if (hasChanges) {
        console.log("Updating profile in database:", updates);
        const updatedProfile = await updateUserProfile(authUser.email, updates);
        console.log("Updating profile in auth context");
        const updatedUser = await updateUser(updates);

        // If updateUser returns void, use the updated profile from the database
        const finalProfile = updatedUser || updatedProfile;
        setProfile(finalProfile);
        toast.success("Profile updated successfully");
        return finalProfile;
      } else {
        console.log("No changes detected, skipping update");
        return profile;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        description: "Please try again later.",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Update the URL when the tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/profile${value !== "profile" ? `?tab=${value}` : ""}`, {
      replace: true,
    });
  };

  if (authLoading || isLoading || !profile) {
    return <ProfileLoading />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information and how others see you on the
                  platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileInformation
                  profile={profile}
                  setProfile={setProfile}
                  updateUser={handleProfileUpdate}
                  isUpdating={isUpdating}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AccountSettings
                  profile={profile}
                  setProfile={setProfile}
                  updateUser={handleProfileUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationSettings
                  profile={profile}
                  setProfile={setProfile}
                  updateUser={handleProfileUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
