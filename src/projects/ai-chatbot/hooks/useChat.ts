import { useState, useEffect, useCallback } from "react"; // Added useEffect import
import { Message, ChatState } from "../types";
import { useStreamingResponse } from "./useStreamingResponse";
import { v4 as uuidv4 } from "uuid";

const initialChatState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

export const useChat = () => {
  const [chatState, setChatState] = useState<ChatState>(initialChatState);
  const { isLoading: isAIThinking, error: aiError, getResponse } = useStreamingResponse();

  // Update loading state based on AI hook
  useEffect(() => { // Corrected from useState to useEffect
    setChatState(prev => ({ ...prev, isLoading: isAIThinking, error: aiError }));
  }, [isAIThinking, aiError]);


  const addMessage = useCallback((message: Message) => {
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: "user",
      timestamp: Date.now(),
    };

    // Add user message immediately using functional update
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    // Get AI response - pass the messages including the new user message
    // Use the state value directly here, as the functional update above might not be processed yet
    const messagesWithNewUserMessage = [...chatState.messages, userMessage];

    const aiResponseText = await getResponse(messagesWithNewUserMessage);

    if (aiResponseText) {
      const aiMessage: Message = {
        id: uuidv4(),
        text: aiResponseText,
        sender: "ai",
        timestamp: Date.now(),
      };
      // Add AI message - use functional update again
      setChatState(prev => ({
        ...prev, // Spread previous state
        messages: [...prev.messages, aiMessage], // Add new AI message
      }));
    }
  }, [getResponse, chatState.messages]); // Added chatState.messages to dependencies

  return {
    chatState,
    sendMessage,
    isLoading: chatState.isLoading,
    error: chatState.error,
  };
};