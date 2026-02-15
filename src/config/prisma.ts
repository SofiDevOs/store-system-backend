import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { DATABASE_URL } from "./envs.config";

// Remove 'file:' prefix if present
const dbPath = (DATABASE_URL || "./data/dev.db").replace("file:", "");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

export { prisma };
