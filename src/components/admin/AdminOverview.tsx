import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart, Leaf, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useMemo } from "react";

interface AdminOverviewProps {
  profiles: any[];
  products: any[];
  detections: any[];
  activities: any[];
}

const AdminOverview = ({ profiles, products, detections, activities }: AdminOverviewProps) => {
  const recentSignups = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return profiles.filter((p) => new Date(p.created_at) > weekAgo).length;
  }, [profiles]);

  const recentDetections = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return detections.filter((d) => new Date(d.created_at) > weekAgo).length;
  }, [detections]);

  const recentLogins = useMemo(() => {
    return activities
      .filter((a) => a.activity_type === "login")
      .slice(0, 8);
  }, [activities]);

  const topFeatures = useMemo(() => {
    const counts: Record<string, number> = {};
    activities.forEach((a) => {
      const label = formatType(a.activity_type);
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [activities]);

  const statCards = [
    {
      label: "TOTAL USERS",
      value: profiles.length,
      trend: recentSignups > 0 ? `+${recentSignups} this week` : "No new signups",
      trendUp: recentSignups > 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "TOTAL PRODUCTS",
      value: products.length,
      trend: `${products.filter((p) => p.is_available).length} available`,
      trendUp: true,
      icon: ShoppingCart,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      label: "DISEASE DETECTIONS",
      value: detections.length,
      trend: recentDetections > 0 ? `+${recentDetections} this week` : "No new detections",
      trendUp: recentDetections > 0,
      icon: Leaf,
      color: "text-accent-foreground",
      bgColor: "bg-accent",
    },
    {
      label: "TOTAL ACTIVITIES",
      value: activities.length,
      trend: `${activities.filter((a) => a.activity_type === "login").length} logins`,
      trendUp: true,
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Operations Dashboard</h1>
        <p className="text-muted-foreground text-sm">Real-time status of AgroVision platform</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{stat.label}</p>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                {stat.trendUp ? (
                  <TrendingUp className="h-3 w-3 text-primary" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={`text-xs font-medium ${stat.trendUp ? "text-primary" : "text-destructive"}`}>
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two-column: Recent Logins + Top Features */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent User Activity</CardTitle>
              <Badge variant="secondary" className="text-xs">{recentLogins.length} recent</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-4 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>User</span>
                <span>Action</span>
                <span className="text-right">Time</span>
              </div>
              {recentLogins.map((a) => (
                <div key={a.id} className="grid grid-cols-3 gap-4 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground truncate">{a.metadata?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.metadata?.email || a.user_id?.slice(0, 8)}</p>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="text-xs">{formatType(a.activity_type)}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground text-right self-center">
                    {timeAgo(a.created_at)}
                  </p>
                </div>
              ))}
              {recentLogins.length === 0 && (
                <p className="text-center py-8 text-muted-foreground text-sm">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Top Features Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topFeatures.map((f, i) => {
                const max = topFeatures[0]?.count || 1;
                const pct = Math.round((f.count / max) * 100);
                return (
                  <div key={f.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{f.name}</span>
                      <span className="text-xs text-muted-foreground">{f.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%`, opacity: 1 - i * 0.12 }}
                      />
                    </div>
                  </div>
                );
              })}
              {topFeatures.length === 0 && (
                <p className="text-center py-8 text-muted-foreground text-sm">No data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function formatType(type: string): string {
  const map: Record<string, string> = {
    login: "Login",
    disease_detection: "Disease Detection",
    marketplace_view: "Marketplace",
    weather_check: "Weather",
    schemes_view: "Gov Schemes",
    dashboard_view: "Dashboard",
  };
  return map[type] || type;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default AdminOverview;
