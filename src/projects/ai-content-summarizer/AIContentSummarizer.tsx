import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const AIContentSummarizer: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = () => {
    if (!inputText.trim()) return;
    setIsSummarizing(true);
    // Placeholder: simulate summarization delay
    setTimeout(() => {
      // Simple mock summary: first 100 chars + "..."
      const mockSummary = inputText.length > 100 ? inputText.slice(0, 100) + "..." : inputText;
      setSummary(mockSummary);
      setIsSummarizing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 flex flex-col items-center">
      <Card className="max-w-3xl w-full shadow-lg">
        <CardHeader>
          <CardTitle>AI Content Summarizer</CardTitle>
          <CardDescription>
            Paste or type text to generate a concise summary using AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
            disabled={isSummarizing}
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSummarize} disabled={isSummarizing || !inputText.trim()}>
              {isSummarizing ? "Summarizing..." : "Summarize"}
            </Button>
          </div>
          {summary && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md text-gray-900 whitespace-pre-wrap">
              {summary}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIContentSummarizer;