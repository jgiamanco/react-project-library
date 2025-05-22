import cohere from 'cohere-ai';
import { Message } from '../types';

// Get API key from environment variables
const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;

// Initialize Cohere client
if (!COHERE_API_KEY) {
  console.error("COHERE_API_KEY is not set in environment variables.");
} else {
  cohere.init(COHERE_API_KEY);
}

// Function to format messages for the Cohere API
const formatMessagesForCohere = (messages: Message[]) => {
  return messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'chatbot',
    message: msg.text,
  }));
};

export const generateResponse = async (messages: Message[]): Promise<string> => {
  if (!COHERE_API_KEY) {
    throw new Error("Cohere API key is not configured.");
  }

  console.log("Cohere Service: Sending messages to API:", messages);

  try {
    // Get the latest user message
    const latestUserMessage = messages.findLast(msg => msg.sender === 'user');
    const history = formatMessagesForCohere(messages.filter(msg => msg.id !== latestUserMessage?.id));

    const response = await cohere.chat({
      model: 'command-r-plus-08-2024', // Use the specified model
      message: latestUserMessage?.text || '',
      chatHistory: history,
      // You can add other parameters here, like temperature, etc.
    });

    console.log("Cohere Service: Received response:", response);

    // Extract the text from the response
    const aiResponseText = response.text;

    if (!aiResponseText) {
      throw new Error("No text response received from Cohere API.");
    }

    return aiResponseText;

  } catch (error: any) {
    console.error("Error calling Cohere API:", error);
    // Provide a more user-friendly error message
    throw new Error(`Failed to get response from AI: ${error.message || 'Unknown error'}`);
  }
};