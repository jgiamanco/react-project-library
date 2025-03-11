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
import { getUserProfile, updateUserProfile } from "@/services/db-service";
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
  const [profile, setProfile] = useState<User>({
    email: "",
    displayName: "",
    photoURL: "",
    bio: "Tell us about yourself...",
    location: "",
    website: "",
    github: "",
    twitter: "",
    role: "Developer",
    theme: "system",
    emailNotifications: true,
    pushNotifications: false,
  });

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
        const dbProfile = await getUserProfile(user.email);
        if (dbProfile) {
          setProfile({
            email: dbProfile.email,
            displayName: dbProfile.displayName,
            photoURL: dbProfile.photoURL || "",
            bio: dbProfile.bio || "Tell us about yourself...",
            location: dbProfile.location || "",
            website: dbProfile.website || "",
            github: dbProfile.github || "",
            twitter: dbProfile.twitter || "",
            role: dbProfile.role || "Developer",
            theme: dbProfile.theme || "system",
            emailNotifications: dbProfile.emailNotifications ?? true,
            pushNotifications: dbProfile.pushNotifications ?? false,
          });
        } else {
          // If no profile exists, create one with default values
          const defaultProfile = {
            email: user.email,
            displayName: user.displayName || user.email.split("@")[0],
            photoURL: user.photoURL || "",
            bio: "Tell us about yourself...",
            role: "Developer",
            theme: "system",
            emailNotifications: true,
            pushNotifications: false,
          };
          await updateUserProfile(user.email, defaultProfile);
          setProfile(defaultProfile as User);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadUserProfile();
  }, [user, authLoading, navigate]);

  // Handle profile updates
  const handleProfileUpdate = async (updates: Partial<User>) => {
    if (!user?.email) return;

    setIsUpdating(true);
    try {
      // Update database
      await updateUserProfile(user.email, updates);

      // Update auth context
      await updateUser(updates);

      // Update local state
      setProfile((prev) => ({ ...prev, ...updates }));

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
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

  if (authLoading || isUpdating) {
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
