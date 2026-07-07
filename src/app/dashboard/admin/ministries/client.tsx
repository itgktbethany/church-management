"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createMinistry, assignUserToMinistry } from "@/actions/ministry";
import { Loader2 } from "lucide-react";

interface MinistriesAdminClientProps {
  initialMinistries: { id: string; name: string; description: string | null }[];
  users: { id: string; name: string | null; email: string }[];
}

export function MinistriesAdminClient({ initialMinistries, users }: MinistriesAdminClientProps) {
  const router = useRouter();
  
  // Create state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Assign state
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Ministry name is required");
    
    setIsCreating(true);
    const res = await createMinistry(name, description);
    setIsCreating(false);

    if (res.success) {
      toast.success("Ministry created successfully!");
      setName("");
      setDescription("");
      router.refresh();
    } else {
      toast.error(res.message || "Failed to create ministry");
    }
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedMinistry) return toast.error("Select both a user and a ministry");
    
    setIsAssigning(true);
    const res = await assignUserToMinistry(selectedUser, selectedMinistry);
    setIsAssigning(false);

    if (res.success) {
      toast.success("User assigned successfully!");
      setSelectedUser("");
      router.refresh();
    } else {
      toast.error(res.message || "Failed to assign user");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Ministry</CardTitle>
          <CardDescription>Add a new ministry service to the church.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ministry Name</label>
            <Input 
              placeholder="e.g., Usher, Worship Team..." 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea 
              placeholder="Brief description..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="resize-none"
            />
          </div>
          <Button onClick={handleCreate} disabled={isCreating} className="w-full">
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Ministry
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assign User to Ministry</CardTitle>
          <CardDescription>Select a member and assign them to an active ministry.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Member</label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a member" />
              </SelectTrigger>
              <SelectContent>
                {users.map(u => (
                  <SelectItem key={u.id} value={u.id}>{u.name || u.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Ministry</label>
            <Select value={selectedMinistry} onValueChange={setSelectedMinistry}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a ministry" />
              </SelectTrigger>
              <SelectContent>
                {initialMinistries.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAssign} disabled={isAssigning || !initialMinistries.length} className="w-full" variant="secondary">
            {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign User
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
