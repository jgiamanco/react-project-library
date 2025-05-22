import { useState, useCallback } from "react";
import { generateResponse } from "../services/aiService";

export const useStreamingResponse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getResponse = useCallback(async (message: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate streaming by returning the full response after a delay
      const response = await generateResponse(message);
      setIsLoading(false);
      return response;
    } catch (err) {
      console.error("Error generating response:", err);
      setError("Failed to get response from AI.");
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