import { supabase } from "@/services/supabase-client"; // Import Supabase client
import { Message } from '../types';

// Remove direct cohere import and init call

export const generateResponse = async (messages: Message[]): Promise<string> => {
  console.log("Client AI Service: Invoking Edge Function with messages:", messages);

  try {
    // Invoke the Edge Function
    const { data, error } = await supabase.functions.invoke('chat-completion', {
      body: { messages: messages }, // Pass the messages array in the body
    });

    if (error) {
      console.error("Error invoking Edge Function:", error);
      throw new Error(`Edge Function error: ${error.message}`);
    }

    // Assuming the Edge Function returns { response: string }
    const aiResponseText = data?.response;

    if (!aiResponseText) {
      throw new Error("No response text received from Edge Function.");
    }

    console.log("Client AI Service: Received response from Edge Function:", aiResponseText);
    return aiResponseText;

  } catch (error: any) {
    console.error("Error in client AI Service:", error);
    // Provide a more user-friendly error message
    throw new Error(`Failed to get response from AI: ${error.message || 'Unknown error'}`);
  }
};