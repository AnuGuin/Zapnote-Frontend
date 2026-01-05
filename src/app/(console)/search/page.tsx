"use client"

import { useState, useCallback } from "react"
import { Search, Sparkles, Filter, X } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { SearchResults } from "@/src/components/console/search/search-results"
import { useWorkspace } from "@/src/context/workspace-context"
import { searchApi, type SearchResult } from "@/src/lib/api/search"
import { toast } from "sonner"
import type { ContentType } from "@/src/types/workspace"

const contentTypes: ContentType[] = [
  "ARTICLE",
  "VIDEO",
  "DOCUMENT",
  "AUDIO",
  "SOCIAL POST",
  "CODE",
  "IMAGE",
  "OTHER",
]

export default function SearchPage() {
  const { currentWorkspace } = useWorkspace()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchType, setSearchType] = useState<"semantic" | "hybrid">("semantic")
  const [selectedContentType, setSelectedContentType] = useState<ContentType | "all">("all")
  const [showFilters, setShowFilters] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query")
      return
    }

    if (!currentWorkspace) {
      toast.error("Please select a workspace first")
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      const searchInput = {
        query: query.trim(),
        limit: 50,
        filters: {
          ...(selectedContentType !== "all" && {
            contentType: selectedContentType,
          }),
        },
      }

      const searchFn =
        searchType === "semantic"
          ? searchApi.semanticSearch
          : searchApi.hybridSearch

      const response = await searchFn(currentWorkspace.id, searchInput)
      setResults(response.results)

      if (response.results.length === 0) {
        toast.info("No results found. Try different keywords.")
      }
    } catch (error) {
      console.error("Search failed:", error)
      toast.error("Search failed. Please try again.")
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [query, currentWorkspace, searchType, selectedContentType])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearFilters = () => {
    setSelectedContentType("all")
  }

  const hasActiveFilters = selectedContentType !== "all"

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center max-w-md">
          <p className="text-muted-foreground mb-4">
            Please select a workspace to start searching
          </p>
          <Button onClick={() => window.location.href = "/home"}>
            Go to Home
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold mb-2">Search</h1>
        <p className="text-muted-foreground">
          Search across your knowledge base in {currentWorkspace.name}
        </p>
      </div>

      <Card className="p-6 shrink-0">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for articles, videos, documents..."
                className="pl-10 h-12 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
              />
            </div>
            <Button
              size="lg"
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="px-8"
            >
              {isSearching ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <Tabs
              value={searchType}
              onValueChange={(value: string) => setSearchType(value as "semantic" | "hybrid")}
            >
              <TabsList>
                <TabsTrigger value="semantic" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Semantic
                </TabsTrigger>
                <TabsTrigger value="hybrid" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Hybrid
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  1
                </Badge>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Filter Results</p>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 gap-2"
                  >
                    <X className="h-3 w-3" />
                    Clear filters
                  </Button>
                )}
              </div>

              <div className="grid gap-3">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    Content Type
                  </label>
                  <Select
                    value={selectedContentType}
                    onValueChange={(value) =>
                      setSelectedContentType(value as ContentType | "all")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {contentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex-1 overflow-y-auto min-h-0">
        {hasSearched ? (
          <SearchResults
            results={results}
            query={query}
            isLoading={isSearching}
          />
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start Searching</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter keywords to search across all your saved items. Use semantic search
              for meaning-based results or hybrid for keyword + semantic matching.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}