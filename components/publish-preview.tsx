"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar } from "lucide-react"
import { generateSlug } from "@/lib/markdown"
import type { Draft } from "@/lib/storage"

interface PublishPreviewProps {
  drafts: Draft[]
}

export function PublishPreview({ drafts }: PublishPreviewProps) {
  if (drafts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">No drafts selected</h3>
            <p className="text-muted-foreground">Select drafts from the drafts page to publish them.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Publishing Preview</h3>
        <Badge variant="secondary">
          {drafts.length} draft{drafts.length > 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid gap-4">
        {drafts.map((draft) => {
          const slug = generateSlug(draft.title)
          const filePath = `content/${slug}.md`

          return (
            <Card key={draft.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{draft.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      Last updated {draft.updatedAt.toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">File path:</span>{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-xs">{filePath}</code>
                  </div>
                  {draft.body && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Preview:</span> {draft.body.substring(0, 100)}
                      {draft.body.length > 100 && "..."}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
