"use client";

import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/motion-tab";

const TAB_IDS = [
  "ARTICLE",
  "VIDEO",
  "AUDIO",
  "SOCIAL POST",
  "DOCUMENT",
  "CODE",
];

export default function CateogoryView() {
  return (
    <div className="w-full">
      <Tabs defaultValue={TAB_IDS[0]} className="w-full">
        <TabsList
          className="w-full justify-between bg-muted/50 p-1 border rounded-lg"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        >
          {TAB_IDS.map((id) => (
            <TabsTrigger key={id} value={id} className="capitalize flex-1">
              {id.toLowerCase().replace("_", " ")}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
