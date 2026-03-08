import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminRoleManager from "@/components/admin/AdminRoleManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, ShoppingCart, BarChart3, Leaf, Trash2, Shield, UserCog } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [detections, setDetections] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, products: 0, detections: 0 });

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
    const p = profilesRes.data || [];
    const pr = productsRes.data || [];
    const d = detectionsRes.data || [];
    const a = activitiesRes.data || [];
    setProfiles(p);
    setProducts(pr);
    setDetections(d);
    setActivities(a);
    setStats({ users: p.length, products: pr.length, detections: d.length });
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Failed to delete product");
    else {
      setProducts(products.filter((p) => p.id !== id));
      setStats((s) => ({ ...s, products: s.products - 1 }));
      toast.success("Product removed");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <Card className="px-4 py-2 border-primary/20 bg-accent/30">
            <p className="text-xs text-muted-foreground">Logged in as Admin</p>
            <p className="text-sm font-medium text-foreground">{user?.email}</p>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="p-3 rounded-full bg-primary/10"><Users className="h-6 w-6 text-primary" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.users}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="p-3 rounded-full bg-secondary/10"><ShoppingCart className="h-6 w-6 text-secondary" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.products}</p>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="p-3 rounded-full bg-accent"><Leaf className="h-6 w-6 text-accent-foreground" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.detections}</p>
                <p className="text-sm text-muted-foreground">Disease Detections</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="analytics"><BarChart3 className="mr-2 h-4 w-4" />Analytics</TabsTrigger>
            <TabsTrigger value="roles"><UserCog className="mr-2 h-4 w-4" />Roles</TabsTrigger>
            <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" />Users</TabsTrigger>
            <TabsTrigger value="products"><ShoppingCart className="mr-2 h-4 w-4" />Products</TabsTrigger>
            <TabsTrigger value="detections"><Leaf className="mr-2 h-4 w-4" />Detections</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AdminAnalytics profiles={profiles} products={products} detections={detections} activities={activities} />
          </TabsContent>

          <TabsContent value="roles">
            <AdminRoleManager profiles={profiles} currentUserId={user!.id} />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader><CardTitle>All Users ({profiles.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profiles.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-foreground">{p.full_name || "Unnamed"}</p>
                        <p className="text-sm text-muted-foreground">
                          {p.farm_location && `📍 ${p.farm_location}`}
                          {p.crop_type && ` · 🌾 ${p.crop_type}`}
                          {p.farm_size && ` · ${p.farm_size}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Joined {new Date(p.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {profiles.length === 0 && <p className="text-center py-8 text-muted-foreground">No users yet.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader><CardTitle>All Products ({products.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
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
          </TabsContent>

          <TabsContent value="detections">
            <Card>
              <CardHeader><CardTitle>Recent Detections ({detections.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {detections.map((d) => (
                    <div key={d.id} className="p-4 rounded-lg border border-border">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
