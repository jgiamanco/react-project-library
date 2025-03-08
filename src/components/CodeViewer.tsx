import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeFile {
  name: string;
  language: string;
  content: string;
}

interface CodeViewerProps {
  files: CodeFile[];
  title?: string;
}

const CodeViewer = ({ files, title = "Project Code" }: CodeViewerProps) => {
  const [activeTab, setActiveTab] = useState(files[0]?.name || "");

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {files.map((file) => (
              <TabsTrigger
                key={file.name}
                value={file.name}
                className="min-w-fit"
              >
                {file.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {files.map((file) => (
            <TabsContent key={file.name} value={file.name}>
              <ScrollArea className="h-[600px] rounded-md border">
                <SyntaxHighlighter
                  language={file.language}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: "0.5rem",
                    background: "transparent",
                  }}
                  showLineNumbers
                >
                  {file.content}
                </SyntaxHighlighter>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeViewer;
