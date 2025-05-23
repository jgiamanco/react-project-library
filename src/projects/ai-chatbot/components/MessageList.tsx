import React, { useEffect, useRef } from "react";
import { Message } from "../types";
import MessageItem from "./MessageItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom when new messages arrive or loading state changes
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
        <div ref={messagesEndRef} /> {/* Dummy div to scroll to */}
      </div>
    </ScrollArea>
  );
};

export default MessageList;