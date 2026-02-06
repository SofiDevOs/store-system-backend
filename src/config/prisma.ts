import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { DATABASE_URL } from "./envs.config";
const adapter = new PrismaBetterSqlite3({ url: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export{
    prisma
}
