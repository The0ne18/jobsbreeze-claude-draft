/*
  Warnings:

  - Added the required column `subtotal` to the `Estimate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "LineItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estimateId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unitPrice" REAL NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LineItem_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Estimate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estimateId" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "amount" REAL NOT NULL,
    "tax" REAL NOT NULL DEFAULT 0,
    "taxRate" REAL NOT NULL DEFAULT 0,
    "subtotal" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" DATETIME,
    "notes" TEXT,
    "terms" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Estimate_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Estimate" ("amount", "clientId", "createdAt", "date", "estimateId", "id", "isDraft", "status", "updatedAt") SELECT "amount", "clientId", "createdAt", "date", "estimateId", "id", "isDraft", "status", "updatedAt" FROM "Estimate";
DROP TABLE "Estimate";
ALTER TABLE "new_Estimate" RENAME TO "Estimate";
CREATE UNIQUE INDEX "Estimate_estimateId_key" ON "Estimate"("estimateId");
CREATE INDEX "Estimate_clientId_idx" ON "Estimate"("clientId");
CREATE INDEX "Estimate_status_idx" ON "Estimate"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "LineItem_estimateId_idx" ON "LineItem"("estimateId");
