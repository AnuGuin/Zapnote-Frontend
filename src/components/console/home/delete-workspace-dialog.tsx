"use client"

import { useState } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { useWorkspace } from "@/src/context/workspace-context"
import { toast } from "sonner"

interface DeleteWorkspaceDialogProps {
  workspaceId: string
  workspaceName: string
}

export function DeleteWorkspaceDialog({ workspaceId, workspaceName }: DeleteWorkspaceDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteWorkspace } = useWorkspace()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteWorkspace(workspaceId)
      setOpen(false)
    } catch (error) {
      // Error is handled in context with toast
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Workspace
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{workspaceName}</strong>? This action cannot be undone and all data within this workspace will be permanently lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Workspace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
