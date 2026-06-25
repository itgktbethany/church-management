import { getGroups } from "@/actions/group";
import Link from "next/link";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { GroupActions } from "./group-actions";

export async function GroupTable() {
  const result = await getGroups();

  if (!result.success) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Failed to load groups.
        </CardContent>
      </Card>
    );
  }

  const data = result.data ?? [];

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No groups found.
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
                    Group Name
                  </th>

                  <th className="p-5 text-left">
                    Description
                  </th>

                  <th className="p-5 text-left">
                    Status
                  </th>

                  <th className="p-5 text-left">
                    Created At
                  </th>

                  <th className="p-5 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((group) => (
                  <tr
                    key={group.id}
                    className="
                      border-b
                      hover:bg-muted/40
                      transition-colors
                    "
                  >
                    <td className="p-5 font-medium">
                      <Link
                      href={`/dashboard/admin/groups/${group.id}`}
                      className="font-medium text-primary hover:underline">
                      {group.name}
                      </Link>
                    </td>

                    <td className="p-5">
                      {group.description ||
                        "-"}
                    </td>

                    <td className="p-5">
                      {group.isActive ? (
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
                      {new Date(
                        group.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-5">
                      <GroupActions
                        group={group}
                      />
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
        {data.map((group) => (
          <Card key={group.id}>
            <CardContent className="space-y-4 p-4">
              <div>
                <h3 className="font-medium">
                  {group.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {group.description ||
                    "No description"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.isActive ? (
                  <Badge>
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    Inactive
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Created:{" "}
                {new Date(
                  group.createdAt
                ).toLocaleDateString()}
              </p>

              <div className="flex justify-end">
                <GroupActions
                  group={group}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}