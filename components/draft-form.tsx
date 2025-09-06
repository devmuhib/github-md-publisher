"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Plus } from "lucide-react";
import { ContentPreview } from "./content-preview";
import { saveDraft, type Draft } from "@/lib/storage";
import { toast } from "sonner";

interface DraftFormProps {
  draft?: Draft;
  onSave?: (draft: Draft) => void;
  onCancel?: () => void;
}

export function DraftForm({ draft, onSave, onCancel }: DraftFormProps) {
  const [title, setTitle] = useState(draft?.title || "");
  const [body, setBody] = useState(draft?.body || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (draft) {
      setTitle(draft.title);
      setBody(draft.body);
    }
  }, [draft]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.message("Title required", {
        description: "Please enter a title for your draft.",
      });
      return;
    }

    setSaving(true);

    try {
      const savedDraft = saveDraft({
        ...(draft || {}),
        title: title.trim(),
        body: body.trim(),
      });

      toast.success("Draft saved", {
        description: `"${savedDraft.title}" has been saved successfully.`,
      });

      onSave?.(savedDraft);
    } catch (error) {
      toast.message("Save failed", {
        description: "Failed to save draft. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const isEditing = !!draft;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Save className="h-5 w-5 text-primary" />
                Edit Draft
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-primary" />
                Create New Draft
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Content</Label>
            <ContentPreview
              initialContent={body}
              onChange={setBody}
              placeholder="Write your post content in Markdown..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="min-w-[100px]"
            >
              {saving ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-pulse" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </>
              )}
            </Button>

            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
