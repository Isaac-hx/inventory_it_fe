import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router";
import { Badge } from "../ui/badge";

type AppNavbarProps = {
  onOpenSidebar: () => void;
};

export default function AppNavbar({ onOpenSidebar }: AppNavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={onOpenSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <h2 className="text-sm text-slate-500">Welcome back,</h2>
          <p className="font-semibold">{user?.Username ?? "User"}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">

        <Badge variant="ghost">
            {user?.Role??"-"}
        </Badge>

        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}