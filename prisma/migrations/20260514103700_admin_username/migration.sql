-- Sostituisce email con username per il login.
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_Admin" (
    "id",
    "username",
    "name",
    "passwordHash",
    "role",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    CASE
        WHEN instr("email", '@') > 0 THEN lower(replace(substr("email", 1, instr("email", '@') - 1), '.', '_'))
        ELSE lower(replace("email", '.', '_'))
    END,
    "name",
    "passwordHash",
    "role",
    "createdAt",
    "updatedAt"
FROM "Admin";

DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

PRAGMA foreign_keys=ON;
