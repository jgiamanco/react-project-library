
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeViewerProps {
  files: { name: string; content: string; language: string }[];
  onBack: () => void;
  title: string;
}

const CodeViewer = ({ files, onBack, title }: CodeViewerProps) => {
  const [activeFile, setActiveFile] = useState(files[0]?.name || "");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Code copied to clipboard",
      description: "You can now paste it in your editor",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-background py-4 px-6 fixed top-0 w-full z-10 shadow-sm">
        <Button 
          variant="ghost" 
          className="mb-2"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-xl font-bold">{title} - Code</h1>
      </div>
      
      <div className="pt-20 pb-10 px-4 md:px-6 flex-grow flex flex-col">
        <div className="bg-gray-50 border rounded-lg overflow-hidden flex flex-col h-full">
          <div className="border-b">
            <TabsList className="w-full justify-start h-12 px-2 rounded-none">
              {files.map((file) => (
                <TabsTrigger
                  key={file.name}
                  value={file.name}
                  onClick={() => setActiveFile(file.name)}
                  className={activeFile === file.name ? "bg-white" : ""}
                >
                  {file.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <div className="flex-grow relative">
            {files.map((file) => (
              <div
                key={file.name}
                className={`absolute inset-0 overflow-auto ${
                  activeFile === file.name ? "block" : "hidden"
                }`}
              >
                <div className="p-4 relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">{file.language}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => copyToClipboard(file.content)}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <code>{file.content}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;
