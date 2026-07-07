import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";

async function main() {
  const queryClient = postgres(process.env.DATABASE_URL!);
  try {
    const result = await queryClient`SELECT column_name FROM information_schema.columns WHERE table_name='user'`;
    console.log("Columns in user table:", result.map(r => r.column_name).join(", "));
  } catch(e) {
    console.error("Error:", e);
  } finally {
    await queryClient.end();
  }
}
main();
