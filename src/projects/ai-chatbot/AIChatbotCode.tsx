import CodeViewer from "@/components/CodeViewer";

const AIChatbotCode = () => {
  const files = {
    "AIChatbot.tsx": `import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ChatInterface from "./components/ChatInterface";
import { useChat } from "./hooks/useChat";

const AIChatbot: React.FC = () => {
  const { chatState, sendMessage } = useChat();

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-foreground/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">AI Chatbot</CardTitle>
          <CardDescription>Chat with a mock AI assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <ChatInterface
            messages={chatState.messages}
            onSendMessage={sendMessage}
            isLoading={chatState.isLoading}
          />
          {chatState.error && (
            <div className="text-red-500 text-sm mt-2">{chatState.error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChatbot;`,
    "components/ChatInterface.tsx": `import React, { useState } from "react";
import MessageList from "./MessageList";
import InputForm from "./InputForm";
import ModelSelector from "./ModelSelector";
import { Message } from "../types";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [selectedModel, setSelectedModel] = useState("Mock AI");

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">AI Chat</h3>
        {/* Model selector can be added here if needed */}
        {/* <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} /> */}
      </div>
      <MessageList messages={messages} isLoading={isLoading} />
      <InputForm onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;`,
    "components/MessageItem.tsx": `import React from "react";
import { Message } from "../types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-avatar.png" alt="AI Avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "rounded-lg p-3 text-sm max-w-[75%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {message.text}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-avatar.png" alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageItem;`,
    "components/InputForm.tsx": `import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface InputFormProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <Input
        placeholder="Type your message..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        disabled={isLoading}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading || !inputText.trim()}>
        <Send className="h-4 w-4 mr-2" />
        Send
      </Button>
    </form>
  );
};

export default InputForm;`,
    "components/MessageList.tsx": `import React, { useEffect, useRef } from "react";
import { Message } from "../types";
import MessageItem from "./MessageItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <ScrollArea className="h-[400px] lg:h-[500px] p-4 border rounded-md">
      <div className="flex flex-col space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="text-center text-muted-foreground">
            Start a conversation with the AI!
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-t-primary border-gray-200 rounded-full animate-spin"></div>
            <span className="ml-2 text-sm text-muted-foreground">AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;`,
    "components/ModelSelector.tsx": `import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const availableModels = ["Mock AI"];

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="model-select" className="text-sm text-muted-foreground">Model:</Label>
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger id="model-select" className="w-[180px] h-8">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {availableModels.map(model => (
            <SelectItem key={model} value={model}>{model}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;`,
    "hooks/useChat.ts": `import { useState, useCallback } from "react";
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

    addMessage(userMessage);

    const aiResponseText = await getResponse(text);

    if (aiResponseText) {
      const aiMessage: Message = {
        id: uuidv4(),
        text: aiResponseText,
        sender: "ai",
        timestamp: Date.now(),
      };
      addMessage(aiMessage);
    }
  }, [addMessage, getResponse]);

  return {
    chatState,
    sendMessage,
    isLoading: chatState.isLoading,
    error: chatState.error,
  };
};`,
    "hooks/useStreamingResponse.ts": `import { useState, useCallback } from "react";
import { generateResponse } from "../services/aiService";

export const useStreamingResponse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getResponse = useCallback(async (message: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
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
};`,
    "services/aiService.ts": `// This is a mock AI service. In a real application, this would interact with an LLM API.

interface MockAIResponse {
  text: string;
  delay: number; // milliseconds
}

const mockResponses: Record<string, MockAIResponse> = {
  "hello": { text: "Hello there! How can I help you today?", delay: 800 },
  "how are you": { text: "I am a language model, I don't have feelings, but I'm ready to assist!", delay: 1000 },
  "what is react": { text: "React is a JavaScript library for building user interfaces.", delay: 1200 },
  "tell me a joke": { text: "Why don't scientists trust atoms? Because they make up everything!", delay: 1500 },
};

export const generateResponse = async (message: string): Promise<string> => {
  console.log("Mock AI Service: Received message:", message);
  const lowerCaseMessage = message.toLowerCase().trim();

  const response = mockResponses[lowerCaseMessage] || {
    text: \`I received your message: "\${message}". I'm a simple mock AI for this demo. Try asking "hello" or "what is react".\`,
    delay: 1500,
  };

  await new Promise(resolve => setTimeout(resolve, response.delay));

  console.log("Mock AI Service: Sending response:", response.text);
  return response.text;
};`,
    "types.ts": `export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}`,
    "utils/formatMessages.ts": `// Placeholder utility function - can be expanded later
export const formatMessageText = (text: string): string => {
  return text.trim();
};`,
  };

  return <CodeViewer files={files} />;
};

export default AIChatbotCode;