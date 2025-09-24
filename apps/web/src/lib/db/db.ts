import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

let db: NodePgDatabase;
try {
  db = drizzle(process.env.DATABASE_URL!);
} catch (error) {
  throw new Error("Failed to connect to database", { cause: error });
}

export default db;
