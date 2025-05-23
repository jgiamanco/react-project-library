import { useState, useCallback } from "react";
import { generateResponse } from "../services/aiService";
import { Message } from "../types";

export const useStreamingResponse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modified to accept message history
  const getResponse = useCallback(async (messages: Message[]): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // Pass the full message history to the AI service
      const response = await generateResponse(messages);
      setIsLoading(false);
      return response;
    } catch (err: any) {
      console.error("Error generating response:", err);
      setError(err.message || "Failed to get response from AI.");
      setIsLoading(false);
      return null;
    }
  }, []);

  return {
    isLoading,
    error,
    getResponse,
  };
};