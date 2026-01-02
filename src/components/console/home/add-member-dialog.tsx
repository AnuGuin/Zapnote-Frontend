"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { useWorkspace } from "@/src/context/workspace-context"
import type { WorkspaceRole } from "@/src/types/workspace"

interface AddMemberDialogProps {
  workspaceId: string
}

export function AddMemberDialog({ workspaceId }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<WorkspaceRole>("VIEWER")
  const [loading, setLoading] = useState(false)
  const { addMember } = useWorkspace()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !email.includes("@")) {
      return
    }

    setLoading(true)
    try {
      await addMember(workspaceId, {
        email: email.trim(),
        role,
      })
      setEmail("")
      setRole("VIEWER")
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
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Invite someone to collaborate on this workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select value={role} onValueChange={(value) => setRole(value as WorkspaceRole)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIEWER">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Viewer</span>
                      <span className="text-xs text-muted-foreground">Can view workspace content</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="EDITOR">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Editor</span>
                      <span className="text-xs text-muted-foreground">Can add and edit content</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="OWNER">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Owner</span>
                      <span className="text-xs text-muted-foreground">Full access including member management</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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
            <Button type="submit" disabled={loading || !email.trim()}>
              {loading ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}