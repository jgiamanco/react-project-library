import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Camera } from "lucide-react";
import { ImageCropper } from "./image-cropper";

// Sample suggested avatars
const suggestedAvatars = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Jasmine",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Max",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Lily",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophie",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Ethan",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe",
];

interface AvatarUploadProps {
  currentAvatar: string;
  onAvatarChange: (avatarUrl: string) => void;
  name: string;
  isLoading?: boolean;
}

export function AvatarUpload({
  currentAvatar,
  onAvatarChange,
  name,
  isLoading = false,
}: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Increased max size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("File must be an image");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImageUrl(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setSelectedAvatar(croppedImageUrl);
    setIsCropping(false);
  };

  const handleSave = () => {
    onAvatarChange(selectedAvatar);
    setIsOpen(false);
    // Reset state
    setUploadedImageUrl(null);
    setIsCropping(false);
  };

  const handleCancel = () => {
    setSelectedAvatar(currentAvatar);
    setUploadedImageUrl(null);
    setIsCropping(false);
    setIsOpen(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative group">
          <Avatar className="h-20 w-20 cursor-pointer">
            <AvatarImage src={currentAvatar} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Avatar</DialogTitle>
          <DialogDescription>
            Choose a new avatar or upload your own image.
          </DialogDescription>
        </DialogHeader>

        {isCropping && uploadedImageUrl ? (
          <div className="py-4">
            <ImageCropper
              imageUrl={uploadedImageUrl}
              onCropComplete={handleCropComplete}
              aspectRatio={1}
            />
          </div>
        ) : (
          <Tabs defaultValue="suggested" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="suggested">Suggested</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="suggested" className="mt-4">
              <div className="grid grid-cols-4 gap-2">
                {suggestedAvatars.map((avatar, index) => (
                  <Avatar
                    key={index}
                    className={`h-16 w-16 cursor-pointer transition-all ${
                      selectedAvatar === avatar
                        ? "ring-2 ring-primary ring-offset-2"
                        : "hover:scale-105"
                    }`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    <AvatarImage
                      src={avatar}
                      alt={`Avatar option ${index + 1}`}
                    />
                  </Avatar>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="upload" className="mt-4">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedAvatar} alt="Avatar preview" />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center">
                  <Button
                    onClick={triggerFileInput}
                    variant="outline"
                    className="mb-2"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. Max 5MB.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {!isCropping && <Button onClick={handleSave}>Save Changes</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
