import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/services/supabase-client";

const AIContentSummarizer: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    setIsSummarizing(true);
    setError(null);
    setSummary(null);
    try {
      const { data, error } = await supabase.functions.invoke("summarize-content", {
        body: { text: inputText },
      });

      if (error) {
        console.error("Error from summarization edge function:", error);
        setError(error.message || "Failed to generate summary");
      } else if (data?.summary) {
        setSummary(data.summary);
      } else {
        setError("No summary returned from server");
      }
    } catch (err: any) {
      console.error("Error calling summarization edge function:", err);
      setError(err.message || "Failed to generate summary");
    } finally {
      setIsSummarizing(false);
    }
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
          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
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