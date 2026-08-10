import { EventTable } from "@/components/admin/events/event-table";
import { CreateEventDialog } from "@/components/admin/events/create-event-dialog";

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Event Management
          </h1>
          <p className="text-muted-foreground">
            Manage events for point additions and deductions.
          </p>
        </div>

        <div className="flex gap-2">
          <CreateEventDialog />
        </div>
      </div>

      <EventTable />
    </div>
  );
}
