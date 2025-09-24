import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import * as schema from "./schema";
import "dotenv/config";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await reset(db, schema);

  try {
    await seed(db, schema).refine(() => ({
      masterResume: {
        count: 1,
      },
      jobPosting: {
        count: 5,
        with: {
          adaptedResume: 1,
        },
      },
    }));
  } catch (error) {
    console.error(error);
  } finally {
    await db.$client.end();
  }
}

main();
