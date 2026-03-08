import { cn } from "@/lib/utils";
import { BarChart3, Users, ShoppingCart, Leaf, UserCog, Shield, LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userEmail?: string;
}

const navItems = [
  { id: "overview", label: "Dashboard", icon: BarChart3 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "roles", label: "Role Manager", icon: UserCog },
  { id: "users", label: "Users", icon: Users },
  { id: "products", label: "Products", icon: ShoppingCart },
  { id: "detections", label: "Detections", icon: Leaf },
];

const AdminSidebar = ({ activeTab, onTabChange, userEmail }: AdminSidebarProps) => {
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-r border-border">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="p-2 rounded-lg bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-bold text-foreground text-sm">AgroVision</p>
          <p className="text-xs text-muted-foreground">Admin Console</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-primary/10 text-primary border-l-3 border-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-4 space-y-2">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Site
        </button>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{userEmail}</p>
            <p className="text-xs text-muted-foreground">System Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
