"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, List } from "lucide-react"
import { DraftForm } from "./draft-form"
import { DraftList } from "./draft-list"
import type { Draft } from "@/lib/storage"

export function DraftManager() {
  const [activeTab, setActiveTab] = useState("list")
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null)
  const [selectedDrafts, setSelectedDrafts] = useState<Draft[]>([])

  const handleEdit = (draft: Draft) => {
    setEditingDraft(draft)
    setActiveTab("form")
  }

  const handleSave = (draft: Draft) => {
    // Refresh the list by switching tabs
    setActiveTab("list")
    setEditingDraft(null)
  }

  const handleCancel = () => {
    setEditingDraft(null)
    setActiveTab("list")
  }

  const handleNewDraft = () => {
    setEditingDraft(null)
    setActiveTab("form")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Draft Management</h1>
        <Button onClick={handleNewDraft}>
          <Plus className="h-4 w-4 mr-2" />
          New Draft
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Drafts
          </TabsTrigger>
          <TabsTrigger value="form" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {editingDraft ? "Edit" : "Create"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <DraftList onEdit={handleEdit} onSelectionChange={setSelectedDrafts} selectedDrafts={selectedDrafts} />
        </TabsContent>

        <TabsContent value="form">
          <DraftForm draft={editingDraft || undefined} onSave={handleSave} onCancel={handleCancel} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
