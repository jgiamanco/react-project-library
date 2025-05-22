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
  useState(() => {
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
    addMessage(userMessage);

    // Get AI response
    const aiResponseText = await getResponse(text);

    if (aiResponseText) {
      const aiMessage: Message = {
        id: uuidv4(),
        text: aiResponseText,
        sender: "ai",
        timestamp: Date.now(),
      };
      // Add AI message
      addMessage(aiMessage);
    }
  }, [addMessage, getResponse]);

  return {
    chatState,
    sendMessage,
    isLoading: chatState.isLoading,
    error: chatState.error,
  };
};