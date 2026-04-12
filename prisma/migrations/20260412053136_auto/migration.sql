/*
  Warnings:

  - Added the required column `phone` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_employees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "nss" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "salary" REAL NOT NULL DEFAULT 0.0,
    "vacationDays" INTEGER NOT NULL DEFAULT 0,
    "birthdate" DATETIME NOT NULL,
    "isRehired" BOOLEAN NOT NULL DEFAULT false,
    "profileImage" TEXT,
    "position" TEXT,
    "department" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_employees" ("address", "birthdate", "createdAt", "id", "isRehired", "lastname", "name", "nss", "profileImage", "rfc", "salary", "userId", "vacationDays") SELECT "address", "birthdate", "createdAt", "id", "isRehired", "lastname", "name", "nss", "profileImage", "rfc", "salary", "userId", "vacationDays" FROM "employees";
DROP TABLE "employees";
ALTER TABLE "new_employees" RENAME TO "employees";
CREATE UNIQUE INDEX "employees_nss_key" ON "employees"("nss");
CREATE UNIQUE INDEX "employees_rfc_key" ON "employees"("rfc");
CREATE UNIQUE INDEX "employees_phone_key" ON "employees"("phone");
CREATE UNIQUE INDEX "employees_userId_key" ON "employees"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
