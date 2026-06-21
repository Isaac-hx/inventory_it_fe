import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Users,
  Building2,
  Tags,
  Boxes,
  Laptop,
  Wrench,
  ClipboardList,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const dashboard = 
  { label: "Dashboard", path: "/", icon: LayoutDashboard,roles:["superuser","admin_it"] }
const masterMenus = [
  { label: "Users", path: "/users", icon: Users,roles:["superuser"] },
  { label: "Departments", path: "/departments", icon: Building2,roles:["superuser"] },
  { label: "Brands", path: "/brands", icon: Tags,roles:["superuser","admin_it"] },
  { label: "Categories", path: "/categories", icon: Boxes,roles:["superuser","admin_it"] },
  { label: "Assets", path: "/assets", icon: Laptop,roles:["superuser","admin_it"] },
];

const otherMenus = [
  { label: "Assignments", path: "/asset-assignments", icon: ClipboardList,roles:["superuser","admin_it"] },
  { label: "Maintenances", path: "/maintenances", icon: Wrench ,roles:["superuser","admin_it"]},
];

function MenuItem({ menu }: { menu }) {
  const Icon = menu.icon;

  return (
    <NavLink
      to={menu.path}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-primary text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {menu.label}
    </NavLink>
  );
}

export default function AppSidebar() {
    const user = useAuthStore((state)=>state.user)
    const currentRole = user?.Role ?? "user";
    const filteredMasterMenus = masterMenus.filter((menu) =>
    menu.roles.includes(currentRole)
    );

const filteredOtherMenus = otherMenus.filter((menu) =>
  menu.roles.includes(currentRole)
);
  return (
    <aside className="h-full w-64 border-r bg-white">
      <div className="flex h-16 items-center border-b px-8">
        <h1 className="text-md font-bold">ITB Inventory Asset IT</h1>
      </div>

      <nav className="space-y-6 p-4">
        <div>
          <MenuItem menu={dashboard} key={dashboard.path}/>
        </div>
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase text-slate-400">
            Master Data
          </p>
          <div className="space-y-1">
            {filteredMasterMenus.map((menu) => (
              <MenuItem key={menu.path} menu={menu} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase text-slate-400">
            Other Menu
          </p>
          <div className="space-y-1">
            {filteredOtherMenus.map((menu) => (
              <MenuItem key={menu.path} menu={menu} />
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}