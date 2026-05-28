import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function GET() {
  const data = await db.select().from(users);

  return Response.json(data);
}