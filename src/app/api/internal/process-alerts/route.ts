import { processPendingAlerts } from "@/services/notifications";
import { headers } from "next/headers";

export async function POST() {
  try {
    const authorization = (await headers()).get("authorization");

    if (
      authorization !==
      `Bearer ${process.env.CRON_SECRET}`
    ) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const result = await processPendingAlerts();

    return Response.json(result);
  } catch (error) {
    console.error(
      "Failed to process alerts:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Failed to process alerts",
      },
      {
        status: 500,
      }
    );
  }
}