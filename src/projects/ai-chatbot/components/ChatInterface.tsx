import React, { useState } from "react";
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
  const [selectedModel, setSelectedModel] = useState("Mock AI"); // State for model selection

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

export default ChatInterface;