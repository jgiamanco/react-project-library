import React from "react";
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

export default AIChatbot;