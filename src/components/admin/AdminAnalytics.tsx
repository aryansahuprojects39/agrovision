import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

interface AdminAnalyticsProps {
  profiles: any[];
  products: any[];
  detections: any[];
  activities: any[];
}

const COLORS = [
  "hsl(142, 60%, 35%)",
  "hsl(45, 80%, 55%)",
  "hsl(200, 60%, 50%)",
  "hsl(0, 84%, 60%)",
  "hsl(280, 60%, 50%)",
  "hsl(30, 80%, 55%)",
];

const AdminAnalytics = ({ profiles, products, detections, activities }: AdminAnalyticsProps) => {
  const featureUsageData = useMemo(() => {
    const counts: Record<string, number> = {};
    activities.forEach((a) => {
      const label = formatActivityType(a.activity_type);
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [activities]);

  const signupsByDay = useMemo(() => {
    const days: Record<string, number> = {};
    profiles.forEach((p) => {
      const day = new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      days[day] = (days[day] || 0) + 1;
    });
    return Object.entries(days).map(([date, count]) => ({ date, users: count }));
  }, [profiles]);

  const loginsByDay = useMemo(() => {
    const days: Record<string, number> = {};
    activities
      .filter((a) => a.activity_type === "login")
      .forEach((a) => {
        const day = new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        days[day] = (days[day] || 0) + 1;
      });
    return Object.entries(days).map(([date, logins]) => ({ date, logins }));
  }, [activities]);

  const detectionsByDisease = useMemo(() => {
    const counts: Record<string, number> = {};
    detections.forEach((d) => {
      counts[d.disease] = (counts[d.disease] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [detections]);

  const productsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [products]);

  const recentLogins = useMemo(() => {
    return activities
      .filter((a) => a.activity_type === "login")
      .slice(0, 10);
  }, [activities]);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">{activities.length}</p>
            <p className="text-sm text-muted-foreground">Total Activities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">{activities.filter(a => a.activity_type === "login").length}</p>
            <p className="text-sm text-muted-foreground">Total Logins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">{detections.length}</p>
            <p className="text-sm text-muted-foreground">Detections</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">{products.length}</p>
            <p className="text-sm text-muted-foreground">Products Listed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Feature Usage</CardTitle></CardHeader>
          <CardContent>
            {featureUsageData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={featureUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(142, 20%, 88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(142, 60%, 35%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No activity data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Logins Over Time</CardTitle></CardHeader>
          <CardContent>
            {loginsByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={loginsByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(142, 20%, 88%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="logins" stroke="hsl(142, 60%, 35%)" strokeWidth={2} dot={{ fill: "hsl(142, 60%, 35%)" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No login data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Top Detected Diseases</CardTitle></CardHeader>
          <CardContent>
            {detectionsByDisease.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={detectionsByDisease} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
                    {detectionsByDisease.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No detection data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Products by Category</CardTitle></CardHeader>
          <CardContent>
            {productsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={productsByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(142, 20%, 88%)" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(45, 80%, 55%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No products yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User signups */}
      <Card>
        <CardHeader><CardTitle className="text-base">User Signups Over Time</CardTitle></CardHeader>
        <CardContent>
          {signupsByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={signupsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(142, 20%, 88%)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="users" fill="hsl(200, 60%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No signup data yet</p>
          )}
        </CardContent>
      </Card>

      {/* Recent logins table */}
      <Card>
        <CardHeader><CardTitle className="text-base">Recent Logins</CardTitle></CardHeader>
        <CardContent>
          {recentLogins.length > 0 ? (
            <div className="space-y-2">
              {recentLogins.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.metadata?.email || a.user_id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">{a.metadata?.name || "User"}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No login records yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function formatActivityType(type: string): string {
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

export default AdminAnalytics;
