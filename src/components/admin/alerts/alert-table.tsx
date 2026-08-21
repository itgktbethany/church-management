import { getAlerts } from "@/actions/alert";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { AlertActions } from "./alert-actions";
import { LocalTime } from "@/components/ui/local-time";

export async function AlertTable() {
  const data = await getAlerts();

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No alerts found.
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
                  <th className="p-5 text-left">
                    Title
                  </th>

                  <th className="p-5 text-left">
                    Message
                  </th>

                  <th className="p-5 text-left">
                    Display At
                  </th>

                  <th className="p-5 text-left">
                    Push
                  </th>

                  <th className="p-5 text-left">
                    Status
                  </th>

                  <th className="p-5 text-left">
                    Target
                  </th>

                  <th className="p-5 text-left">
                    Schedule
                  </th>

                  <th className="p-5 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((alert) => (
                  <tr
                    key={alert.id}
                    className="
                      border-b
                      hover:bg-muted/40
                      transition-colors
                    "
                  >
                    <td className="p-5 font-medium">
                      {alert.title}
                    </td>

                    <td className="p-5">
                      <p className="line-clamp-2 max-w-md">
                        {alert.message}
                      </p>
                    </td>

                    <td className="p-5">
                      {alert.displayAt
                        ? <LocalTime date={alert.displayAt} formatStr="MMM d, yyyy, h:mm a" />
                        : "-"}
                    </td>

                    <td className="p-5">
                      {alert.sendPush ? (
                        <Badge>
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Disabled
                        </Badge>
                      )}
                    </td>

                    <td className="p-5">
                      {alert.isActive ? (
                        <Badge>
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Inactive
                        </Badge>
                      )}
                    </td>

                    <td className="p-5">
                      <Badge variant="outline">
                        {alert.targetType}
                      </Badge>
                    </td>

                    <td className="p-5">
                      <Badge variant={alert.scheduleType === "recurring" ? "default" : "secondary"}>
                        {alert.scheduleType === "recurring"
                          ? `Recurring`
                          : "One-time"}
                      </Badge>
                      {alert.scheduleType === "recurring" && alert.cronExpression && (
                        <p className="mt-1 text-xs text-muted-foreground font-mono">
                          {alert.cronExpression}
                        </p>
                      )}
                    </td>

                    <td className="p-5">
                      <AlertActions alert={alert}/>
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
        {data.map((alert) => (
          <Card key={alert.id}>
            <CardContent className="space-y-4 p-4">
              <div>
                <h3 className="font-medium">
                  {alert.title}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {alert.message}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {alert.sendPush ? (
                  <Badge>
                    Push Enabled
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    Push Disabled
                  </Badge>
                )}

                {alert.isActive ? (
                  <Badge>
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    Inactive
                  </Badge>
                )}

                <Badge variant="outline">
                  {alert.targetType}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Display At:{" "}
                {alert.displayAt
                  ? <LocalTime date={alert.displayAt} formatStr="MMM d, yyyy, h:mm a" />
                  : "-"}
              </p>

               <div className="flex items-center justify-between">
                              <Badge>
                                Published
                              </Badge>
              
                              <AlertActions
                                alert={alert}
                              />
                  </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}