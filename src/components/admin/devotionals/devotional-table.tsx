import { getDevotionals } from "@/actions/devotional";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { DevotionalActions } from "./devotional-actions";

export async function DevotionalTable() {
  const data = await getDevotionals();

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
                    Verse
                  </th>

                  <th className="p-5 text-left">
                    Publish Date
                  </th>

                  <th className="p-5 text-left">
                    Status
                  </th>

                  <th className="p-5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.id}
                    className="
                      border-b
                      hover:bg-muted/40
                      transition-colors
                    "
                  >
                    <td className="p-5">
                      <div>
                        <p className="font-medium">
                          {item.title}
                        </p>

                        <p className="line-clamp-1 text-sm text-muted-foreground">
                          {item.content}
                        </p>
                      </div>
                    </td>

                    <td className="p-5">
                      {item.verse}
                    </td>

                    <td className="p-5">
                      {item.publishDate}
                    </td>

                    <td className="p-5">
                      <Badge>
                        Published
                      </Badge>
                    </td>

                    <td className="p-5 text-right">
                      <DevotionalActions
                        devotional={item}
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
        {data.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-4 p-4">
              <div>
                <h3 className="font-medium">
                  {item.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {item.content}
                </p>
              </div>

              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">
                    Verse:
                  </span>{" "}
                  {item.verse}
                </p>

                <p>
                  <span className="font-medium">
                    Publish:
                  </span>{" "}
                  {item.publishDate}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Badge>
                  Published
                </Badge>

                <DevotionalActions
                  devotional={item}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}