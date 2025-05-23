import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ImageIcon } from "lucide-react";

const IMAGE_SIZES = [
  { label: "1:1 (512x512)", value: "512x512" },
  { label: "16:9 (768x432)", value: "768x432" },
  { label: "4:3 (640x480)", value: "640x480" },
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Call the Supabase Edge Function to generate image via Google Gemini
async function generateImageFromGoogleGemini(
  positivePrompt: string,
  negativePrompt: string,
  size: string
): Promise<string> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/gemini-image-generation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ positivePrompt, negativePrompt, size }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate image");
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Error calling Gemini image generation edge function:", error);
    throw error;
  }
}

const AIImageGenerator: React.FC = () => {
  const [positivePrompt, setPositivePrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [imageSize, setImageSize] = useState(IMAGE_SIZES[0].value);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!positivePrompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setImageUrl(null);
    try {
      const url = await generateImageFromGoogleGemini(positivePrompt, negativePrompt, imageSize);
      setImageUrl(url);
    } catch (err: any) {
      setError(err.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 flex flex-col items-center">
      <Card className="max-w-3xl w-full shadow-lg">
        <CardHeader>
          <CardTitle>AI Image Generator</CardTitle>
          <CardDescription>
            Generate unique images using Google Gemini's text-to-image API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="positive-prompt" className="block font-medium mb-1">
                Positive Prompt
              </label>
              <Textarea
                id="positive-prompt"
                placeholder="Describe what you want to see..."
                value={positivePrompt}
                onChange={(e) => setPositivePrompt(e.target.value)}
                disabled={isGenerating}
                rows={4}
              />
            </div>
            <div>
              <label htmlFor="negative-prompt" className="block font-medium mb-1">
                Negative Prompt (optional)
              </label>
              <Textarea
                id="negative-prompt"
                placeholder="Describe what to avoid..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                disabled={isGenerating}
                rows={4}
              />
            </div>
            <div>
              <label htmlFor="image-size" className="block font-medium mb-1">
                Image Size / Ratio
              </label>
              <Select
                value={imageSize}
                onValueChange={(value) => setImageSize(value)}
              >
                <SelectTrigger id="image-size" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !positivePrompt.trim()}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate Image"}
            </Button>
            {error && (
              <div className="mt-2 text-red-600 font-medium">{error}</div>
            )}
          </div>
          <div className="mt-6 flex justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Generated"
                className="max-w-full max-h-[400px] rounded-md shadow"
              />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-2" />
                <p>Generated images will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIImageGenerator;