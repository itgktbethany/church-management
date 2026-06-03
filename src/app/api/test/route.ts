import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

export async function GET() {
  const data = await db.select().from(user);

  return Response.json(data);
}