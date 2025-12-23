"use client"

import React, { createContext, useContext, useState } from "react"

type SpacesContextType = {
  selectedTool: { type: 'link', url: string, label: string } | null
  setSelectedTool: (tool: { type: 'link', url: string, label: string } | null) => void
}

const SpacesContext = createContext<SpacesContextType | undefined>(undefined)

export function SpacesProvider({ children }: { children: React.ReactNode }) {
  const [selectedTool, setSelectedTool] = useState<{ type: 'link', url: string, label: string } | null>(null)

  return (
    <SpacesContext.Provider value={{ selectedTool, setSelectedTool }}>
      {children}
    </SpacesContext.Provider>
  )
}

export function useSpaces() {
  const context = useContext(SpacesContext)
  if (context === undefined) {
    // It's possible this is used outside the provider (e.g. if sidebar is used elsewhere), 
    // but for now we assume it's within ConsoleLayout.
    // Or we can return a dummy object if we want to be safe, but throwing is better for debugging.
    // However, if the sidebar is rendered in a context where SpacesProvider is missing, it might crash.
    // Given the structure, ConsoleSidebar is inside ConsoleLayout, so it should be fine.
    // But let's be safe and return a default if context is missing, or just throw.
    // I'll stick to throwing for now to ensure correct usage.
    throw new Error("useSpaces must be used within a SpacesProvider")
  }
  return context
}
