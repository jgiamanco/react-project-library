
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

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser, isLoading: authLoading } = useAuth();

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

  // Update profile state when user data changes
  useEffect(() => {
    if (user) {
      console.log("User data loaded in ProfilePage:", user);
      setProfile({
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        bio: user.bio || "Tell us about yourself...",
        location: user.location || "",
        website: user.website || "",
        github: user.github || "",
        twitter: user.twitter || "",
        role: user.role || "Developer",
        theme: user.theme || "system",
        emailNotifications: user.emailNotifications !== undefined ? user.emailNotifications : true,
        pushNotifications: user.pushNotifications !== undefined ? user.pushNotifications : false,
      });
    }
  }, [user]);

  // Update the URL when the tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/profile${value !== "profile" ? `?tab=${value}` : ""}`, {
      replace: true,
    });
  };

  // Show loading state when user data is loading
  if (authLoading) {
    return <ProfileLoading />;
  }

  // If no user is found, redirect to sign in
  if (!user && !authLoading) {
    useEffect(() => {
      navigate("/signin", { replace: true });
    }, [navigate]);
    
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
                  updateUser={async (updates) => {
                    return await updateUser(updates);
                  }} 
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
                  updateUser={async (updates) => {
                    return await updateUser(updates);
                  }} 
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
                  updateUser={async (updates) => {
                    return await updateUser(updates);
                  }} 
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
