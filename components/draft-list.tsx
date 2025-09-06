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
import { Badge } from "@/components/ui/badge";
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
import { Edit, Trash2, FileText, Calendar } from "lucide-react";
import { getDrafts, deleteDraft, type Draft } from "@/lib/storage";

interface DraftListProps {
  onEdit?: (draft: Draft) => void;
  onSelectionChange?: (selectedDrafts: Draft[]) => void;
  selectedDrafts?: Draft[];
}

export function DraftList({
  onEdit,
  onSelectionChange,
  selectedDrafts = [],
}: DraftListProps) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDrafts = () => {
    setLoading(true);
    const loadedDrafts = getDrafts();
    setDrafts(loadedDrafts);
    setLoading(false);
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handleDelete = (draftId: string) => {
    deleteDraft(draftId);
    loadDrafts();
    // Remove from selection if it was selected
    if (selectedDrafts.some((d) => d.id === draftId)) {
      const newSelection = selectedDrafts.filter((d) => d.id !== draftId);
      onSelectionChange?.(newSelection);
    }
  };

  const handleSelect = (draft: Draft, selected: boolean) => {
    if (selected) {
      onSelectionChange?.([...selectedDrafts, draft]);
    } else {
      onSelectionChange?.(selectedDrafts.filter((d) => d.id !== draft.id));
    }
  };

  const isSelected = (draftId: string) =>
    selectedDrafts.some((d) => d.id === draftId);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Loading drafts...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (drafts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">No drafts yet</h3>
            <p className="text-muted-foreground">
              Create your first draft to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Drafts ({drafts.length})</h2>
        {selectedDrafts.length > 0 && (
          <Badge variant="secondary">{selectedDrafts.length} selected</Badge>
        )}
      </div>

      <div className="grid gap-4">
        {drafts.map((draft) => (
          <Card
            key={draft.id}
            className={`transition-colors ${
              isSelected(draft.id) ? "ring-2 ring-primary" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {draft.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    Updated {draft.updatedAt.toLocaleDateString()} at{" "}
                    {draft.updatedAt.toLocaleTimeString()}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <input
                    type="checkbox"
                    checked={isSelected(draft.id)}
                    onChange={(e) => handleSelect(draft, e.target.checked)}
                    className="rounded border-border"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {draft.body && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {draft.body.substring(0, 150)}...
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(draft)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {draft.title}? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(draft.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
