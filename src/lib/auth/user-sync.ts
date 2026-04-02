import { prisma } from "@/lib/prisma";
import type { AuthenticatedAdUser } from "@/lib/auth/ad";

export interface SyncedAdminUser {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  lastLoginAt: Date | null;
}

function getDisplayName(user: AuthenticatedAdUser) {
  return user.name?.trim() || user.username;
}

export async function syncAdminUser(user: AuthenticatedAdUser) {
  const id = crypto.randomUUID();

  const [record] = await prisma.$queryRaw<SyncedAdminUser[]>`
    INSERT INTO "AdminUser" ("id", "username", "displayName", "email", "lastLoginAt", "createdAt", "updatedAt")
    VALUES (${id}, ${user.username}, ${getDisplayName(user)}, ${user.email ?? null}, NOW(), NOW(), NOW())
    ON CONFLICT ("username")
    DO UPDATE SET
      "displayName" = EXCLUDED."displayName",
      "email" = EXCLUDED."email",
      "lastLoginAt" = NOW(),
      "updatedAt" = NOW()
    RETURNING "id", "username", "displayName", "email", "lastLoginAt";
  `;

  return record;
}
