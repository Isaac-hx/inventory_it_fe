import { Route, Routes } from "react-router";
import ProtectedRoute from "@/routes/protected-route";
import DashboardLayout from "@/components/layout/dashboard-layout";
import LoginPage from "@/pages/auth/login-page";
import DashboardPage from "@/pages/dashboard/dashboard-page";
import UserPage from "@/pages/user/user-page";
import BrandPage from "@/pages/brands/brand-page";
import DepartmentPage from "@/pages/department/department-page";
import CategoryPage from "@/pages/categories/categories-page";
import AssetPage from "@/pages/assets/asset-page";
import MaintenancePage from "@/pages/maintenance/maintenance-page";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
         <Route element={<ProtectedRoute allowedRoles={["superuser"]} />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/users" element={<UserPage />} />
              <Route path="/departments" element={<DepartmentPage />} />

         </Route>
          <Route element={<ProtectedRoute allowedRoles={["superuser","admin_it"]} />}>
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/brands" element={<BrandPage />} />
              <Route path="/assets" element={<AssetPage />} />
              <Route path="/maintenances" element={<MaintenancePage />} />

          </Route>

        </Route>
      </Route>
    </Routes>
  );
}