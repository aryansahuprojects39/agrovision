import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Edit2, Save, MapPin, Leaf, ShoppingCart, User } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  full_name: string | null;
  farm_location: string | null;
  crop_type: string | null;
  soil_type: string | null;
  farm_size: string | null;
  avatar_url: string | null;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  location: string | null;
  is_available: boolean;
  created_at: string;
}

interface DetectionRecord {
  id: string;
  disease: string;
  confidence: string | null;
  description: string | null;
  created_at: string;
}

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({ full_name: "", farm_location: "", crop_type: "", soil_type: "", farm_size: "", avatar_url: "" });
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<DetectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!authLoading && user) {
      // Redirect admin users to admin dashboard
      supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
        if (data) navigate("/admin", { replace: true });
      });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [profileRes, productsRes, historyRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("products").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("detection_history").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      ]);
      if (profileRes.data) {
        const p = profileRes.data;
        setProfile({ full_name: p.full_name, farm_location: p.farm_location, crop_type: p.crop_type, soil_type: p.soil_type, farm_size: p.farm_size, avatar_url: p.avatar_url });
      }
      setProducts((productsRes.data || []) as Product[]);
      setHistory((historyRes.data || []) as DetectionRecord[]);
      setLoading(false);
    };
    load();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      farm_location: profile.farm_location,
      crop_type: profile.crop_type,
      soil_type: profile.soil_type,
      farm_size: profile.farm_size,
    }).eq("user_id", user.id);
    if (error) toast.error("Failed to update profile");
    else { toast.success("Profile updated!"); setEditing(false); }
    setSaving(false);
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { setProducts(products.filter((p) => p.id !== id)); toast.success("Product removed"); }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>
          <TabsList>
            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
            <TabsTrigger value="products"><ShoppingCart className="mr-2 h-4 w-4" />My Products</TabsTrigger>
            <TabsTrigger value="history"><Leaf className="mr-2 h-4 w-4" />Detection History</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Farm Profile</CardTitle>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}><Edit2 className="mr-2 h-4 w-4" />Edit</Button>
                ) : (
                  <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save
                  </Button>
                )}
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", key: "full_name" as const, placeholder: "Your name" },
                  { label: "Farm Location", key: "farm_location" as const, placeholder: "e.g., Punjab, India" },
                  { label: "Crop Type", key: "crop_type" as const, placeholder: "e.g., Wheat, Rice" },
                  { label: "Soil Type", key: "soil_type" as const, placeholder: "e.g., Alluvial, Black" },
                  { label: "Farm Size", key: "farm_size" as const, placeholder: "e.g., 5 acres" },
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      value={profile[field.key] || ""}
                      onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      disabled={!editing}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>My Listed Products ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No products listed yet. Go to the Marketplace to list your produce!</p>
                ) : (
                  <div className="space-y-3">
                    {products.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{p.name}</span>
                            <Badge variant="secondary">{p.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            ₹{p.price}/{p.unit} · {p.quantity} {p.unit} available
                            {p.location && <span className="ml-2"><MapPin className="inline h-3 w-3" /> {p.location}</span>}
                          </p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(p.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detection History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Disease Detection History</CardTitle>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No detection history yet. Try analyzing a crop leaf photo!</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((h) => (
                      <div key={h.id} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-primary" />
                            <span className="font-medium text-foreground">{h.disease}</span>
                            {h.confidence && <Badge variant="outline">{h.confidence}</Badge>}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(h.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {h.description && <p className="text-sm text-muted-foreground mt-2">{h.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
