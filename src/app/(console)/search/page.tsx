import { Input } from "@/src/components/ui/input";
import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="pl-8 w-full max-w-md"
        />
      </div>
    </div>
  );
}
