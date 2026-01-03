"use client"

import { useState } from "react"
import { Link as LinkIcon } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { useWorkspace } from "@/src/context/workspace-context"

interface AddLinkDialogProps {
  workspaceId: string
}

export function AddLinkDialog({ workspaceId }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [intent, setIntent] = useState("")
  const [loading, setLoading] = useState(false)
  const { createKnowledgeItem } = useWorkspace()

  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString)
      return url.protocol === "http:" || url.protocol === "https:"
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim() || !isValidUrl(url.trim())) {
      return
    }

    setLoading(true)
    try {
      await createKnowledgeItem(workspaceId, {
        sourceUrl: url.trim(),
        userIntent: intent.trim() || undefined,
      })
      setUrl("")
      setIntent("")
      setOpen(false)
    } catch (error) {
      // Error handled by context
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <LinkIcon className="h-4 w-4" />
          Add Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Knowledge Link</DialogTitle>
            <DialogDescription>
              Save a link to this workspace. We&apos;ll process and summarize the content for you.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">
                URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              {url && !isValidUrl(url) && (
                <p className="text-xs text-destructive">
                  Please enter a valid URL (starting with http:// or https://)
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="intent">Intent</Label>
              <Textarea
                id="intent"
                placeholder="Why are you saving this? What do you want to learn from it?"
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {intent.length}/500 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !url.trim() || !isValidUrl(url)}>
              {loading ? "Adding..." : "Add Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}