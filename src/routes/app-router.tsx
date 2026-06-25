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
import AssignmentPage from "@/pages/asset-assignments/assignment-page";
import DetailPageUser from "@/pages/user/detail-user-page";
import DetailPageAsset from "@/pages/assets/detail-asset-page";
import DetailPageAssignment from "@/pages/asset-assignments/detail-assignment-page";
import DetailPageMaintenance from "@/pages/maintenance/detail-maintenance-page";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
         <Route element={<ProtectedRoute allowedRoles={["superuser"]} />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/users" element={<UserPage />} />
              <Route path="/users/:user_id" element={<DetailPageUser/>}/>
              <Route path="/departments" element={<DepartmentPage />} />

         </Route>
          <Route element={<ProtectedRoute allowedRoles={["superuser","admin_it"]} />}>
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/brands" element={<BrandPage />} />
              <Route path="/assets" element={<AssetPage />} />
              <Route path="/assets/:asset_id" element={<DetailPageAsset />} />

              <Route path="/maintenances" element={<MaintenancePage />} />
              <Route path="/maintenances/:maintenance_id" element={<DetailPageMaintenance />} />

              <Route path="/asset-assignments" element={<AssignmentPage />} />
              <Route path="/asset-assignments/:assignment_id" element={<DetailPageAssignment />} />

          </Route>

        </Route>
      </Route>
    </Routes>
  );
}