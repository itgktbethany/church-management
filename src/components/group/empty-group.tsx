import { Users } from "lucide-react";

export function EmptyGroup() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <div className="bg-muted p-4 rounded-full mb-4">
        <Users className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No Group Assigned</h2>
      <p className="text-muted-foreground">You haven't joined a group yet. Please contact your administrator or leader to be assigned to a group.</p>
    </div>
  );
}
