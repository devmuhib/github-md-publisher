"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, AlertCircle } from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";

interface GitHubFile {
  name: string;
  path: string;
  content: string;
}

export function GitHubContentFetcher() {
  const [filePath, setFilePath] = useState("content/hello.md");
  const [file, setFile] = useState<GitHubFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    if (!filePath.trim()) {
      setError("Please enter a file path");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/github/fetch?path=${encodeURIComponent(filePath)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch content");
      }

      setFile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchContent();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Fetch GitHub Content
          </CardTitle>
          <CardDescription>
            Enter the path to a Markdown file in your GitHub repository to fetch
            and display its content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., content/hello.md"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={fetchContent}
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching
                </>
              ) : (
                "Fetch"
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {file && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{file.name}</CardTitle>
              <CardDescription>Path: {file.path}</CardDescription>
            </CardHeader>
          </Card>

          <MarkdownRenderer content={file.content} />
        </div>
      )}
    </div>
  );
}
