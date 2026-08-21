"use server";

import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";

import { alerts } from "@/lib/db/schema";

// ====================
// GET ALERTS
// ====================

export async function getAlerts() {
  return await db
    .select()
    .from(alerts)
    .orderBy(
      desc(alerts.createdAt)
    );
}

// ====================
// CREATE ALERT
// ====================

type CreateAlertInput = {
  title: string;
  message: string;
  sendPush: boolean;
  targetType: string;
  displayAt: Date | null;
  scheduleType: string;
  cronExpression?: string | null;
};

export async function createAlert(
  data: CreateAlertInput
) {
  try {

    await db
      .insert(alerts)
      .values({
        title: data.title,
        message: data.message,
        sendPush: data.sendPush,
        targetType: data.targetType,
        displayAt: data.displayAt,
        scheduleType: data.scheduleType,
        cronExpression: data.cronExpression ?? null,
      });

    return {
      success: true,
    };

  } catch {

    return {
      success: false,
      message:
        "Failed creating alert",
    };
  }
}

// ====================
// DELETE ALERT
// ====================

export async function deleteAlert(
  id: string
) {
  try {

    await db
      .delete(alerts)
      .where(
        eq(alerts.id, id)
      );

    return {
      success: true,
    };

  } catch {

    return {
      success: false,
      message:
        "Delete failed",
    };
  }
}

// ====================
// UPDATE ALERT
// ====================

type UpdateAlertInput = {
  id: string;
  title: string;
  message: string;
  sendPush: boolean;
  targetType: string;
  displayAt: Date | null;
  scheduleType: string;
  cronExpression?: string | null;
};

export async function updateAlert(
  data: UpdateAlertInput
) {
  try {

    await db
      .update(alerts)
      .set({
        title: data.title,
        message: data.message,
        sendPush: data.sendPush,
        targetType: data.targetType,
        displayAt: data.displayAt,
        scheduleType: data.scheduleType,
        cronExpression: data.cronExpression ?? null,
        updatedAt: new Date(),
      })
      .where(
        eq(
          alerts.id,
          data.id
        )
      );

    return {
      success: true,
      message: "Alert updated Successfully"
    };

  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        "Update failed",
    };
  }
}

// ====================
// TOGGLE ALERT
// ====================

export async function toggleAlert(
  id: string,
  isActive: boolean
) {
  try {

    await db
      .update(alerts)
      .set({
        isActive,
      })
      .where(
        eq(alerts.id, id)
      );

    return {
      success: true,
    };

  } catch {

    return {
      success: false,
      message:
        "Toggle failed",
    };
  }
}

// ====================
// BULK CREATE ALERTS
// ====================

type BulkAlertInput = {
  title: string;
  message: string;
  send_push: string;
  target_type: string;
  display_at: string;
};

export async function bulkCreateAlerts(
  data: BulkAlertInput[]
) {
  try {
    await db
      .insert(alerts)
      .values(
        data.map((item) => ({
          title: item.title,
          message: item.message,
          sendPush: item.send_push?.toLowerCase() === "true",
          targetType: item.target_type || "all",
          displayAt: item.display_at ? new Date(item.display_at) : null,
        }))
      );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Bulk create alerts error:", error);

    return {
      success: false,
      message: "Bulk upload failed",
    };
  }
}