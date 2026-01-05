"use client";

import React, { createContext, useContext, useState } from "react";
import type { Workspace } from "@/src/types/workspace";

interface WorkspaceContextType {
    currentWorkspace: Workspace | null;
    setCurrentWorkspace: (workspace: Workspace | null) => void;
    workspaces: Workspace[];
    isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const MOCK_WORKSPACES: Workspace[] = [
    {
        id: "default-workspace",
        name: "My Knowledge Base",
        description: "Standard workspace for all notes and clips",
    },
];

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(MOCK_WORKSPACES[0] || null);
    const [workspaces] = useState<Workspace[]>(MOCK_WORKSPACES);
    const [isLoading] = useState(false);

    return (
        <WorkspaceContext.Provider
            value={{
                currentWorkspace,
                setCurrentWorkspace,
                workspaces,
                isLoading,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error("useWorkspace must be used within a WorkspaceProvider");
    }
    return context;
}
