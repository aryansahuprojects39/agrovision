import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, ShieldAlert, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AdminRoleManagerProps {
  profiles: any[];
  currentUserId: string;
}

type AppRole = "admin" | "moderator" | "user";

const AdminRoleManager = ({ profiles, currentUserId }: AdminRoleManagerProps) => {
  const [roles, setRoles] = useState<Record<string, AppRole[]>>({});
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    const { data } = await supabase.from("user_roles").select("*");
    if (data) {
      const map: Record<string, AppRole[]> = {};
      data.forEach((r) => {
        if (!map[r.user_id]) map[r.user_id] = [];
        map[r.user_id].push(r.role as AppRole);
      });
      setRoles(map);
    }
  };

  const handleAssignRole = async (userId: string, role: AppRole) => {
    if (userId === currentUserId && role !== "admin") {
      toast.error("You cannot remove your own admin role");
      return;
    }
    setLoading(userId);
    try {
      // Remove existing roles for user
      await supabase.from("user_roles").delete().eq("user_id", userId);
      // Assign new role
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
      setRoles((prev) => ({ ...prev, [userId]: [role] }));
      toast.success(`Role updated to ${role}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    } finally {
      setLoading(null);
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case "admin": return <ShieldCheck className="h-4 w-4 text-primary" />;
      case "moderator": return <ShieldAlert className="h-4 w-4 text-secondary" />;
      default: return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case "admin": return "default" as const;
      case "moderator": return "secondary" as const;
      default: return "outline" as const;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Role Management ({profiles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {profiles.map((p) => {
            const userRoles = roles[p.user_id] || [];
            const currentRole = userRoles[0] || "user";
            const isSelf = p.user_id === currentUserId;

            return (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  {getRoleIcon(currentRole)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{p.full_name || "Unnamed"}</p>
                      <Badge variant={getRoleBadgeVariant(currentRole)}>{currentRole}</Badge>
                      {isSelf && <Badge variant="outline" className="text-xs">You</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Joined {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {loading === p.user_id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Select value={currentRole} onValueChange={(v) => handleAssignRole(p.user_id, v as AppRole)} disabled={isSelf}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            );
          })}
          {profiles.length === 0 && <p className="text-center py-8 text-muted-foreground">No users yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRoleManager;
