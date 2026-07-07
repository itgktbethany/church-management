"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";

interface GroupSelectorProps {
  groups: { id: string; name: string }[];
  selectedGroupId: string;
}

export function GroupSelector({ groups, selectedGroupId }: GroupSelectorProps) {
  const router = useRouter();

  if (groups.length <= 1) {
    return null; // Only show if they belong to multiple groups
  }

  const handleGroupChange = (newGroupId: string) => {
    router.push(`/dashboard/group?groupId=${newGroupId}`);
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between bg-muted/30 p-4 rounded-lg border gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>Select which group to view</span>
      </div>
      <Select value={selectedGroupId} onValueChange={handleGroupChange}>
        <SelectTrigger className="w-full sm:w-[250px] bg-background">
          <SelectValue placeholder="Select a group" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((g) => (
            <SelectItem key={g.id} value={g.id}>
              {g.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
