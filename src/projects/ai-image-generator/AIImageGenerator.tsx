import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";

const AIImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Placeholder: simulate image generation delay
    setTimeout(() => {
      setImageUrl(`https://via.placeholder.com/512?text=${encodeURIComponent(prompt)}`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 flex flex-col items-center">
      <Card className="max-w-3xl w-full shadow-lg">
        <CardHeader>
          <CardTitle>AI Image Generator</CardTitle>
          <CardDescription>
            Enter a text prompt to generate a unique image using AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter image description..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              className="flex-1"
            />
            <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()}>
              {isGenerating ? "Generating..." : "Generate"}
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

export default AIImageGenerator;