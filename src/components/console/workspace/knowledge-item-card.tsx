"use client"

import { ExternalLink, MoreVertical, Calendar, Tag as TagIcon, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import type { KnowledgeItem } from "@/src/types/workspace"
import { cn } from "@/src/lib/utils"

interface KnowledgeItemCardProps {
  item: KnowledgeItem
}

const contentTypeColors = {
  ARTICLE: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  VIDEO: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  DOCUMENT: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  IMAGE: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  OTHER: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
}

export function KnowledgeItemCard({ item }: KnowledgeItemCardProps) {
  const router = useRouter()

  return (
    <Card className="group hover:shadow-md transition-all">
      <CardHeader className="p-4 pb-2 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("text-xs", contentTypeColors[item.contentType])}>
                {item.contentType}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
            <a 
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-semibold hover:underline line-clamp-2 wrap-break-word"
            >
              {item.summary || item.sourceUrl}
            </a>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => router.push(`/chat?context=${item.id}`)}
              title="Chat with this item"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <a 
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:underline truncate flex items-center gap-1"
        >
          {item.sourceUrl}
          <ExternalLink className="h-3 w-3" />
        </a>

        {item.userIntent && (
          <div className="text-sm bg-muted/50 p-2 rounded-md">
            <span className="font-medium text-xs text-muted-foreground block mb-1">Intent</span>
            {item.userIntent}
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag) => {
               const label = typeof tag === 'string' ? tag : tag.name;
               const key = typeof tag === 'string' ? tag : tag.id;
               return (
                <Badge key={key} variant="secondary" className="text-xs">
                  <TagIcon className="h-3 w-3 mr-1" />
                  {label}
                </Badge>
               )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
