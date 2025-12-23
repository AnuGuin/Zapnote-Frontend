import { AddLinkModal } from "@/src/components/console/home/add-link-modal"

export default function HomePage() {
  return (
    <div className="w-full h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Home</h1>
        <AddLinkModal />
      </div>
      
      <div className="grid gap-4">
        <p className="text-muted-foreground">Welcome to your console.</p>
      </div>
    </div>
  );
}
