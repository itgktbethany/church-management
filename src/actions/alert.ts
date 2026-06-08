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
        displayAt: data.displayAt
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
        displayAt : data.displayAt
      })
      .where(
        eq(
          alerts.id,
          data.id
        )
      );

    return {
      success: true,
    };

  } catch {

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