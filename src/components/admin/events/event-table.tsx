import { getEvents } from "@/actions/events";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventActions } from "./event-actions";

export async function EventTable() {
  const data = await getEvents();

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No events found.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="p-5 text-left">Name</th>
                  <th className="p-5 text-left">Description</th>
                  <th className="p-5 text-left">Type</th>
                  <th className="p-5 text-left">Default Points</th>
                  <th className="p-5 text-left">Status</th>
                  <th className="p-5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b hover:bg-muted/40 transition-colors"
                  >
                    <td className="p-5 font-medium">{event.name}</td>
                    <td className="p-5">
                      <p className="line-clamp-2 max-w-md">{event.description}</p>
                    </td>
                    <td className="p-5">
                      <Badge variant={event.type === "add" ? "default" : "destructive"}>
                        {event.type === "add" ? "Add Points" : "Deduct Points"}
                      </Badge>
                    </td>
                    <td className="p-5">{event.defaultPoints}</td>
                    <td className="p-5">
                      {event.isActive ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </td>
                    <td className="p-5">
                      <EventActions event={event} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile */}
      <div className="space-y-4 md:hidden">
        {data.map((event) => (
          <Card key={event.id}>
            <CardContent className="space-y-4 p-4">
              <div>
                <h3 className="font-medium">{event.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={event.type === "add" ? "default" : "destructive"}>
                  {event.type === "add" ? "Add" : "Deduct"} ({event.defaultPoints})
                </Badge>
                {event.isActive ? (
                  <Badge>Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
              <div className="flex items-center justify-end">
                <EventActions event={event} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
