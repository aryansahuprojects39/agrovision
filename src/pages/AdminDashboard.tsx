import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import ThemeToggle from "@/components/ThemeToggle";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminRoleManager from "@/components/admin/AdminRoleManager";
import AdminNotifications from "@/components/admin/AdminNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, ShoppingCart, Leaf, Trash2, Shield, UserCog, BarChart3, Menu, X, Sun, Moon } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [detections, setDetections] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!authLoading && user) {
      checkAdminRole();
    }
  }, [user, authLoading, navigate]);

  const checkAdminRole = async () => {
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: user!.id,
      _role: "admin",
    });
    if (error || !data) {
      toast.error("Access denied. Admin only.");
      navigate("/");
      return;
    }
    setIsAdmin(true);
    loadData();
  };

  const loadData = async () => {
    const [profilesRes, productsRes, detectionsRes, activitiesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("detection_history").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("user_activity").select("*").order("created_at", { ascending: false }).limit(500),
    ]);
    setProfiles(profilesRes.data || []);
    setProducts(productsRes.data || []);
    setDetections(detectionsRes.data || []);
    setActivities(activitiesRes.data || []);
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Failed to delete product");
    else {
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product removed");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const mobileNavItems = [
    { id: "overview", label: "Dashboard", icon: BarChart3 },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "roles", label: "Roles", icon: UserCog },
    { id: "users", label: "Users", icon: Users },
    { id: "products", label: "Products", icon: ShoppingCart },
    { id: "detections", label: "Detections", icon: Leaf },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} userEmail={user?.email} profiles={profiles} detections={detections} />

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground text-sm">Admin Console</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <AdminNotifications profiles={profiles} detections={detections} />
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-card border-b border-border px-4 py-2 space-y-1">
            {mobileNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  activeTab === item.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {activeTab === "overview" && (
            <AdminOverview profiles={profiles} products={products} detections={detections} activities={activities} />
          )}

          {activeTab === "analytics" && (
            <AdminAnalytics profiles={profiles} products={products} detections={detections} activities={activities} />
          )}

          {activeTab === "roles" && (
            <AdminRoleManager profiles={profiles} currentUserId={user!.id} />
          )}

          {activeTab === "users" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">All Users ({profiles.length})</h2>
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {profiles.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium text-foreground">{p.full_name || "Unnamed"}</p>
                          <p className="text-sm text-muted-foreground">
                            {p.farm_location && `📍 ${p.farm_location}`}
                            {p.crop_type && ` · 🌾 ${p.crop_type}`}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Joined {new Date(p.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    {profiles.length === 0 && <p className="text-center py-8 text-muted-foreground">No users yet.</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">All Products ({products.length})</h2>
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {products.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{p.name}</span>
                            <Badge variant="secondary">{p.category}</Badge>
                            {!p.is_available && <Badge variant="destructive">Unavailable</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            ₹{p.price}/{p.unit} · {p.quantity} {p.unit}
                            {p.location && ` · 📍 ${p.location}`}
                          </p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(p.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {products.length === 0 && <p className="text-center py-8 text-muted-foreground">No products yet.</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "detections" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Detections ({detections.length})</h2>
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {detections.map((d) => (
                      <div key={d.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-primary" />
                            <span className="font-medium text-foreground">{d.disease}</span>
                            {d.confidence && <Badge variant="outline">{d.confidence}</Badge>}
                          </div>
                          <span className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</span>
                        </div>
                        {d.description && <p className="text-sm text-muted-foreground mt-2">{d.description}</p>}
                      </div>
                    ))}
                    {detections.length === 0 && <p className="text-center py-8 text-muted-foreground">No detections yet.</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
