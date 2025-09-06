"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Edit } from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";

interface ContentPreviewProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export function ContentPreview({
  initialContent = "",
  onChange,
  placeholder = "Enter your Markdown content here...",
}: ContentPreviewProps) {
  const [content, setContent] = useState(initialContent);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange?.(newContent);
  };

  return (
    <Card className="h-[500px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Content Editor</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        <Tabs defaultValue="edit" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="h-[calc(100%-40px)] mt-4">
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={placeholder}
              className="h-full resize-none font-mono text-sm"
            />
          </TabsContent>

          <TabsContent
            value="preview"
            className="h-[calc(100%-40px)] mt-4 overflow-auto"
          >
            {content ? (
              <MarkdownRenderer
                content={content}
                className="h-full border-0 shadow-none p-0"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No content to preview
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
