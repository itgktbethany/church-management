import { processPendingAlerts } from "@/services/notifications";

export async function POST() {
  try {
    const result = await processPendingAlerts();

    return Response.json(result);
  } catch (error) {
    console.error("Failed to process alerts:", error);

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