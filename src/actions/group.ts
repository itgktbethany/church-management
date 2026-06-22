"use server";

import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { groups } from "@/lib/db/group-schema";

export async function getGroups() {
  try {
    const data = await db
      .select()
      .from(groups)
      .orderBy(desc(groups.createdAt));

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Get groups error:", error);

    return {
      success: false,
      message: "Failed to fetch groups",
    };
  }
}

type CreateGroupInput = {
  name: string;
  description?: string;
};

export async function createGroup(data: CreateGroupInput) {
  try {
    const [group] = await db
      .insert(groups)
      .values({
        name: data.name,
        description: data.description || null,
      })
      .returning();

    revalidatePath("/dashboard/admin/groups");

    return {
      success: true,
      data: group,
      message: "Group created successfully",
    };
  } catch (error) {
    console.error("Create group error:", error);

    return {
      success: false,
      message: "Failed to create group",
    };
  }
}

type UpdateGroupInput = {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
};

export async function updateGroup(data: UpdateGroupInput) {
  try {
    const [group] = await db
      .update(groups)
      .set({
        name: data.name,
        description: data.description || null,
        isActive: data.isActive,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, data.id))
      .returning();

    revalidatePath("/dashboard/admin/groups");

    return {
      success: true,
      data: group,
      message: "Group updated successfully",
    };
  } catch (error) {
    console.error("Update group error:", error);

    return {
      success: false,
      message: "Failed to update group",
    };
  }
}

export async function deleteGroup(
  id: string
) {
  try {
    await db
      .delete(groups)
      .where(eq(groups.id, id));

    revalidatePath(
      "/dashboard/admin/groups"
    );

    return {
      success: true,
      message:
        "Group deleted successfully",
    };
  } catch (error) {
    console.error(
      "Delete group error:",
      error
    );

    return {
      success: false,
      message:
        "Failed to delete group",
    };
  }
}

export async function activateGroup(id: string) {
  try {
    await db
      .update(groups)
      .set({
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, id));

    revalidatePath("/dashboard/admin/groups");

    return {
      success: true,
      message: "Group activated successfully",
    };
  } catch (error) {
    console.error("Activate group error:", error);

    return {
      success: false,
      message: "Failed to activate group",
    };
  }
}

export async function getGroupById(id: string) {
  try {
    const [group] = await db
      .select()
      .from(groups)
      .where(eq(groups.id, id));

    return {
      success: true,
      data: group,
    };
  } catch (error) {
    console.error("Get group error:", error);

    return {
      success: false,
      message: "Failed to fetch group",
    };
  }
}

export async function deactivateGroup(
  id: string
) {
  try {
    await db
      .update(groups)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, id));

    revalidatePath(
      "/dashboard/admin/groups"
    );

    return {
      success: true,
      message:
        "Group deactivated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        "Failed to deactivate group",
    };
  }
}