import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
/*
 * Singleton to avoid multiple instances of Prisma in development.
 * We use the extended client type to maintain TypeScript support.
 */
const globalForPrisma = globalThis as unknown as { prisma: any };

const dbPath = process.env.DATABASE_URL;

console.log(`[StoreDB] Using database at: ${dbPath}`);

const adapter = new PrismaBetterSqlite3({
    url: `${dbPath}` || "file:./dev.db",
});
//  Base Prisma Instance
const basePrisma = new PrismaClient({
    adapter,
    log:
        process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
});
/**
 * *Client extension to hash passwords automatically on create and update operations.
 * @returns {PrismaClient} Extended Prisma Client with password hashing.
 */
export const prisma = basePrisma.$extends({
    query: {
        user: {
            async create({ args, query }: any) {
                if (args.data.password) {
                    const salt = await bcrypt.genSalt(10);
                    args.data.password = await bcrypt.hash(
                        args.data.password,
                        salt,
                    );
                }
                return query(args);
            },
            async update({ args, query }: any) {
                if (
                    args.data.password &&
                    typeof args.data.password === "string"
                ) {
                    const salt = await bcrypt.genSalt(10);
                    args.data.password = await bcrypt.hash(
                        args.data.password,
                        salt,
                    );
                }
                return query(args);
            },
            async upsert({ args, query }: any) {
                const salt = await bcrypt.genSalt(10);
                if (args.create.password) {
                    args.create.password = await bcrypt.hash(
                        args.create.password,
                        salt,
                    );
                }
                if (
                    args.update.password &&
                    typeof args.update.password === "string"
                ) {
                    args.update.password = await bcrypt.hash(
                        args.update.password,
                        salt,
                    );
                }
                return query(args);
            },
        },
    },
});

//  Singleton pattern for development
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export * from "@prisma/client";
