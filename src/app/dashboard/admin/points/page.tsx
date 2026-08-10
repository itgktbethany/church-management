import { getEvents } from "@/actions/events";
import { getUsers } from "@/actions/points";
import { ManualPointsForm } from "@/components/admin/points/manual-points-form";

export default async function AdminPointsPage() {
  const events = await getEvents();
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Points Management</h1>
          <p className="text-muted-foreground">
            Manually add or deduct points from users.
          </p>
        </div>
      </div>

      <div className="max-w-xl">
        <ManualPointsForm events={events} users={users} />
      </div>
    </div>
  );
}
