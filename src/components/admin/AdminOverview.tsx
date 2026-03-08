import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, ShoppingCart, Leaf, TrendingUp, TrendingDown, Activity, AlertTriangle, Sparkles, Eye } from "lucide-react";
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
    return activities.filter((a) => a.activity_type === "login").slice(0, 8);
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

  // Disease frequency for "risk" panel
  const diseaseRisks = useMemo(() => {
    const counts: Record<string, number> = {};
    detections.forEach((d) => {
      counts[d.disease] = (counts[d.disease] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([disease, count]) => ({
        disease,
        count,
        risk: count >= 5 ? "High" : count >= 3 ? "Moderate" : "Low",
        riskColor: count >= 5 ? "text-destructive" : count >= 3 ? "text-chart-4" : "text-primary",
        barColor: count >= 5 ? "bg-destructive" : count >= 3 ? "bg-chart-4" : "bg-primary",
        pct: Math.min(100, (count / Math.max(detections.length, 1)) * 100 * 3),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [detections]);

  const activeUsers = useMemo(() => {
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    const unique = new Set(
      activities.filter((a) => new Date(a.created_at) > dayAgo).map((a) => a.user_id)
    );
    return unique.size;
  }, [activities]);

  const statCards = [
    {
      label: "TOTAL USERS",
      value: profiles.length,
      trend: `↗ +${recentSignups} this week`,
      trendUp: recentSignups > 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "ACTIVE TODAY",
      value: activeUsers,
      trend: `${Math.round((activeUsers / Math.max(profiles.length, 1)) * 100)}% of users`,
      trendUp: activeUsers > 0,
      icon: Activity,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "ATTENTION REQUIRED",
      value: diseaseRisks.filter((d) => d.risk === "High").length,
      trend: `Diseases > 5 detections`,
      trendUp: false,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "TOTAL PRODUCTS",
      value: products.length,
      trend: `${products.filter((p) => p.is_available).length} available`,
      trendUp: true,
      icon: ShoppingCart,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Real-time status of AgroVision platform</p>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {stat.label}
                </p>
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

      {/* Two-column: Activity Table + Disease Risk Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity Table */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Real-time User Monitoring</CardTitle>
              <Badge variant="secondary" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                View All
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {/* Table header */}
              <div className="grid grid-cols-4 gap-4 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                <span>User</span>
                <span>Status</span>
                <span>Activity</span>
                <span className="text-right">Last Active</span>
              </div>
              {recentLogins.map((a) => {
                const statusColor = getStatusColor(a.activity_type);
                return (
                  <div
                    key={a.id}
                    className="grid grid-cols-4 gap-4 px-3 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {a.metadata?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {a.metadata?.email || a.user_id?.slice(0, 8)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className={`text-xs ${statusColor}`}>
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current inline-block" />
                        {getStatusLabel(a.activity_type)}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${getActivityLevel(a)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {getActivityLevel(a)}%
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-right self-center">
                      {timeAgo(a.created_at)}
                    </p>
                  </div>
                );
              })}
              {recentLogins.length === 0 && (
                <p className="text-center py-8 text-muted-foreground text-sm">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Disease Risk Panel */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Disease Risk Monitor
            </CardTitle>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
              Detection frequency analysis
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diseaseRisks.length > 0 ? (
                diseaseRisks.map((d) => (
                  <div key={d.disease}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground">{d.disease}</span>
                      <Badge variant="outline" className={`text-xs ${d.riskColor}`}>
                        {d.risk} ({d.count})
                      </Badge>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${d.barColor} transition-all`}
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                    {d.risk === "High" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Frequent detections — consider advisory
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-muted-foreground text-sm">No detections yet</p>
              )}

              {/* Smart Tip */}
              <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Platform Health Tip
                </p>
                <p className="text-xs text-muted-foreground">
                  {profiles.length > 0
                    ? `${activeUsers} of ${profiles.length} users were active in the last 24 hours. ${
                        activeUsers / profiles.length < 0.3
                          ? "Consider sending engagement notifications."
                          : "Healthy engagement rate!"
                      }`
                    : "No users registered yet."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Features */}
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-foreground">Feature Usage Overview</CardTitle>
            <p className="text-xs text-muted-foreground">
              Track which features are most popular among users
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topFeatures.length > 0 ? (
                topFeatures.map((f, i) => {
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
                })
              ) : (
                <p className="text-center py-4 text-muted-foreground text-sm">No data yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Marketplace Overview</CardTitle>
            <p className="text-xs text-muted-foreground">
              Products listed on the marketplace
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {products.filter((p) => p.is_available).length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Available</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {products.filter((p) => !p.is_available).length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Unavailable</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {[...new Set(products.map((p) => p.category))].length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Categories</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {[...new Set(products.map((p) => p.user_id))].length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Sellers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function getStatusColor(type: string): string {
  switch (type) {
    case "login": return "text-primary";
    case "disease_detection": return "text-destructive";
    case "marketplace_view": return "text-chart-4";
    default: return "text-chart-2";
  }
}

function getStatusLabel(type: string): string {
  switch (type) {
    case "login": return "Active";
    case "disease_detection": return "Alert";
    case "marketplace_view": return "Browsing";
    default: return "Active";
  }
}

function getActivityLevel(a: any): number {
  const mins = Math.floor((Date.now() - new Date(a.created_at).getTime()) / 60000);
  if (mins < 5) return 95;
  if (mins < 30) return 72;
  if (mins < 120) return 45;
  return 20;
}

function formatType(type: string): string {
  const map: Record<string, string> = {
    login: "Login",
    disease_detection: "Disease Detection",
    marketplace_view: "Marketplace",
    weather_check: "Weather",
    schemes_view: "Gov Schemes",
    dashboard_view: "Dashboard",
    community_forum: "Community",
  };
  return map[type] || type;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default AdminOverview;
