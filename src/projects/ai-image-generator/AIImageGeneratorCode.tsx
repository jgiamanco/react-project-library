import CodeViewer from "@/components/CodeViewer";

const AIImageGeneratorCode = () => {
  const files = {
    "AIImageGenerator.tsx": `import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ImageIcon } from "lucide-react";

const IMAGE_SIZES = [
  { label: "1:1 (512x512)", value: "512x512" },
  { label: "16:9 (768x432)", value: "768x432" },
  { label: "4:3 (640x480)", value: "640x480" },
];

// Placeholder function to simulate Google Gemini text-to-image API call
async function generateImageFromGoogleGemini(positivePrompt: string, negativePrompt: string, size: string): Promise<string> {
  // TODO: Replace this with actual Google Gemini API integration
  // Use positivePrompt, negativePrompt, and size to request image generation
  // Return the URL of the generated image

  console.log("Simulating Google Gemini API call with:", { positivePrompt, negativePrompt, size });

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // Return a placeholder image URL with prompt text encoded for demo
  return \`https://via.placeholder.com/\${size}?text=\${encodeURIComponent(positivePrompt)}\`;
}

const AIImageGenerator: React.FC = () => {
  const [positivePrompt, setPositivePrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [imageSize, setImageSize] = useState(IMAGE_SIZES[0].value);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!positivePrompt.trim()) return;
    setIsGenerating(true);
    try {
      const url = await generateImageFromGoogleGemini(positivePrompt, negativePrompt, imageSize);
      setImageUrl(url);
    } catch (error) {
      console.error("Error generating image:", error);
      setImageUrl(null);
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
              <Input
                id="positive-prompt"
                placeholder="Describe what you want to see..."
                value={positivePrompt}
                onChange={(e) => setPositivePrompt(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            <div>
              <label htmlFor="negative-prompt" className="block font-medium mb-1">
                Negative Prompt (optional)
              </label>
              <Input
                id="negative-prompt"
                placeholder="Describe what to avoid..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                disabled={isGenerating}
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

export default AIImageGenerator;`,
  };

  return <CodeViewer files={files} />;
};

export default AIImageGeneratorCode;