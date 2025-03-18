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
import { ProfileInformation } from "@/components/profile/ProfileInformation";
import { AccountSettings } from "@/components/profile/AccountSettings";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { getUserProfile, updateUserProfile } from "@/services/user-service";
import { toast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser, isLoading: authLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Get the tab from the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "profile");

  // User profile state
  const [profile, setProfile] = useState<User | null>(null);

  // Load user profile from database
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.email) {
        if (!authLoading) {
          navigate("/signin", { replace: true });
        }
        return;
      }

      try {
        console.log("Loading profile for user:", user.email);
        const dbProfile = await getUserProfile(user.email);

        if (dbProfile) {
          console.log("Profile loaded from database:", dbProfile);
          setProfile({
            ...dbProfile, // Spread database values first
            ...user, // Then override with auth context data
            displayName: dbProfile.displayName || user.displayName,
            photoURL: dbProfile.photoURL || user.photoURL || "",
            bio: dbProfile.bio || "Tell us about yourself...",
            location: dbProfile.location || user.location || "",
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
          // Create a complete default profile
          const defaultProfile: Partial<User> = {
            ...user,
            bio: "Tell us about yourself...",
            website: "",
            github: "",
            twitter: "",
            role: "Developer",
            theme: "system" as const,
            emailNotifications: true,
            pushNotifications: false,
          };

          setProfile(defaultProfile as User);

          // Create the profile in the database
          await updateUserProfile(user.email, defaultProfile);
          console.log("Default profile created in database");
        }
      } catch (error) {
        console.error("Error loading profile:", error);

        // Fall back to complete user object
        if (user) {
          console.log("Falling back to user data with defaults");
          setProfile({
            ...user,
            bio: user.bio || "Tell us about yourself...",
            website: user.website || "",
            github: user.github || "",
            twitter: user.twitter || "",
            role: user.role || "Developer",
            theme: user.theme || "system",
            emailNotifications: user.emailNotifications ?? true,
            pushNotifications: user.pushNotifications ?? false,
          });
        }

        toast({
          title: "Notice",
          description:
            "Using local profile data. Changes may not be saved to the server.",
        });
      }
    };

    loadUserProfile();
  }, [user, authLoading, navigate]);

  // Handle profile updates
  const handleProfileUpdate = async (updates: Partial<User>) => {
    if (!user?.email || !profile) return;

    setIsUpdating(true);
    try {
      // Update auth context
      const updatedUser = await updateUser(updates);

      if (updatedUser) {
        // Update local state
        setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      }

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);

      // Still update the local state even if the server update failed
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));

      toast({
        title: "Warning",
        description:
          "Profile updated locally but changes may not be saved to the server.",
      });
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

  if (authLoading || isUpdating || !profile) {
    return <ProfileLoading />;
  }

  if (!user && !authLoading) {
    return null;
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
