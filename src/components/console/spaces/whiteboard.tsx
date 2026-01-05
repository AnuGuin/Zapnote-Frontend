"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useSpaces } from "@/src/context/spaces-context";
import "@excalidraw/excalidraw/index.css";
import { Button } from "@/src/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  { ssr: false }
);

export default function Whiteboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const { selectedTool, setSelectedTool } = useSpaces();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    try {
      const item = JSON.parse(data);
      if (item.type === 'link' && excalidrawAPI) {
        const appState = excalidrawAPI.getAppState();
        const elements = excalidrawAPI.getSceneElements();

        // Calculate position relative to the scene
        // e.clientX/Y are viewport coordinates
        // We need to subtract the container's offset and account for zoom/scroll
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const sceneX = (x - (appState.offsetLeft || 0)) / appState.zoom.value - appState.scrollX;
        const sceneY = (y - (appState.offsetTop || 0)) / appState.zoom.value - appState.scrollY;

        const textElement = {
          type: "text",
          x: sceneX,
          y: sceneY,
          width: 100, // approximate, will be updated by Excalidraw
          height: 20,
          angle: 0,
          strokeColor: "#1e1e1e",
          backgroundColor: "transparent",
          fillStyle: "hachure",
          strokeWidth: 1,
          strokeStyle: "solid",
          roughness: 1,
          opacity: 100,
          groupIds: [],
          frameId: null,
          roundness: null,
          seed: Math.random(),
          version: 1,
          versionNonce: 0,
          isDeleted: false,
          boundElements: null,
          updated: Date.now(),
          link: item.url,
          text: item.label,
          fontSize: 20,
          fontFamily: 1,
          textAlign: "left",
          verticalAlign: "top",
          baseline: 18,
          containerId: null,
          originalText: item.label,
        };

        excalidrawAPI.updateScene({
          elements: [...elements, textElement],
        });
      }
    } catch (err) {
      console.error("Failed to parse drop data", err);
    }
  };

  const handleCanvasClick = () => {
    if (selectedTool && excalidrawAPI) {
      const appState = excalidrawAPI.getAppState();
      const elements = excalidrawAPI.getSceneElements();

      // Place at center of view
      const sceneX = (appState.width / 2 - (appState.offsetLeft || 0)) / appState.zoom.value - appState.scrollX;
      const sceneY = (appState.height / 2 - (appState.offsetTop || 0)) / appState.zoom.value - appState.scrollY;

      const textElement = {
        type: "text",
        x: sceneX,
        y: sceneY,
        width: 100,
        height: 20,
        angle: 0,
        strokeColor: "#1e1e1e",
        backgroundColor: "transparent",
        fillStyle: "hachure",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        groupIds: [],
        frameId: null,
        roundness: null,
        seed: Math.random(),
        version: 1,
        versionNonce: 0,
        isDeleted: false,
        boundElements: null,
        updated: Date.now(),
        link: selectedTool.url,
        text: selectedTool.label,
        fontSize: 20,
        fontFamily: 1,
        textAlign: "left",
        verticalAlign: "top",
        baseline: 18,
        containerId: null,
        originalText: selectedTool.label,
      };

      excalidrawAPI.updateScene({
        elements: [...elements, textElement],
      });

      setSelectedTool(null);
    }
  }

  const handleSave = () => {
    if (excalidrawAPI) {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      console.log("Saving space...", { elements, appState });
      toast.success("Space saved successfully!");
    }
  };

  return (
    <div
      className="h-full w-full relative"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClickCapture={handleCanvasClick} // Use capture to handle before Excalidraw if needed, or just onClick
    >
      <div className="absolute top-4 right-4 z-50">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Space
        </Button>
      </div>
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
      />
      {selectedTool && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded shadow-lg z-50 pointer-events-none">
          Click to place: {selectedTool.label}
        </div>
      )}
    </div>
  );
}
