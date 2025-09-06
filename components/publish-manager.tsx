"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Loader2, Trash2, AlertCircle, Settings } from "lucide-react";
import { PublishPreview } from "./publish-preview";
import { getDrafts, clearAllDrafts, type Draft } from "@/lib/storage";
import { toast } from "sonner";

export function PublishManager() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [configError, setConfigError] = useState<string | null>(null);

  const loadDrafts = () => {
    const loadedDrafts = getDrafts();
    setDrafts(loadedDrafts);
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handlePublish = async () => {
    if (drafts.length === 0) return;

    setPublishing(true);
    setProgress(0);
    setConfigError(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/github/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ drafts }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await response.json();

      if (response.ok) {
        toast.message("Published successfully", {
          description: `${drafts.length} draft${
            drafts.length > 1 ? "s" : ""
          } published to GitHub.`,
        });
        // Clear drafts after successful publish
        clearAllDrafts();
        setDrafts([]);
      } else {
        if (
          result.error &&
          result.error.includes("Missing environment variables")
        ) {
          setConfigError(result.error);
        }
        toast.message("Publish failed", {
          description: result.error || "Failed to publish drafts to GitHub.",
        });
      }
    } catch (error) {
      toast.message("Publish failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred.",
      });
      setProgress(0);
    } finally {
      setPublishing(false);
    }
  };

  const handleClearDrafts = () => {
    clearAllDrafts();
    setDrafts([]);
    toast("Drafts cleared", {
      description: "All drafts have been removed from local storage.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Publish Drafts</h1>
          <p className="text-muted-foreground mt-1">
            Review and publish your drafts to GitHub as Markdown files in a
            single commit.
          </p>
        </div>
        {drafts.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Drafts</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to clear all drafts? This will
                  permanently delete all {drafts.length} draft
                  {drafts.length > 1 ? "s" : ""} from local storage. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearDrafts}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {configError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>GitHub Configuration Required</strong>
              <br />
              {configError}
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configure
              </a>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {publishing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="font-medium">
                  Publishing drafts to GitHub...
                </span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Creating commit with {drafts.length} file
                {drafts.length > 1 ? "s" : ""}...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Publish to GitHub
          </CardTitle>
          <CardDescription>
            {drafts.length > 0
              ? `Ready to publish ${drafts.length} draft${
                  drafts.length > 1 ? "s" : ""
                } to your GitHub repository.`
              : "No drafts available to publish. Create some drafts first."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PublishPreview drafts={drafts} />

          {drafts.length > 0 && (
            <div className="flex items-center gap-2 pt-4 border-t">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={publishing} className="min-w-[140px]">
                    <Upload className="h-4 w-4 mr-2" />
                    Publish All ({drafts.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Publish Drafts to GitHub
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will create a new commit in your GitHub repository
                      with {drafts.length} Markdown file
                      {drafts.length > 1 ? "s" : ""}. All drafts will be cleared
                      from local storage after successful publishing.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePublish}>
                      Publish Now
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <p className="text-sm text-muted-foreground">
                This will commit all drafts to the{" "}
                <code className="bg-muted px-1 py-0.5 rounded">content/</code>{" "}
                directory.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
