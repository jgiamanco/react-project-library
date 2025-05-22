import { useState, useCallback } from "react";
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
  // Use useEffect instead of useState for side effects based on hook state
  useEffect(() => {
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

    // Add user message immediately
    // Use functional update to ensure we have the latest state
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    // Get AI response - pass the *updated* messages array
    // We need to wait for the state update to complete or pass the new message explicitly
    // A simpler approach is to pass the messages including the new user message
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
        ...prev.messages,
        aiMessage,
      }));
    }
  }, [addMessage, getResponse, chatState.messages]); // Add chatState.messages to dependencies

  return {
    chatState,
    sendMessage,
    isLoading: chatState.isLoading,
    error: chatState.error,
  };
};