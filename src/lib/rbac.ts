// src/lib/rbac.ts

export type Role = "superuser" | "admin_it" | "user";

export function canAccess(userRole: Role | undefined, allowedRoles: Role[]) {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}