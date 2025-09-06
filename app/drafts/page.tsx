import { DraftManager } from "@/components/draft-manager"

export default function DraftsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <DraftManager />
      </div>
    </div>
  )
}
