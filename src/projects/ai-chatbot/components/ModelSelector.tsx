import React from "react";
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
  // This is a placeholder. In a real app, this would list available AI models.
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

export default ModelSelector;