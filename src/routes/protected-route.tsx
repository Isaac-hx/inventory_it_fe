// src/routes/protected-route.tsx

import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/auth.store";
import { canAccess, type Role } from "@/lib/rbac";

type ProtectedRouteProps = {
  allowedRoles?: Role[];
};

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !canAccess(user?.Role, allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}