import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell, UserPlus, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "signup" | "detection_alert";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface AdminNotificationsProps {
  profiles: any[];
  detections: any[];
}

const DETECTION_THRESHOLD = 5; // alert if a disease appears more than 5 times

const AdminNotifications = ({ profiles, detections }: AdminNotificationsProps) => {
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("admin_read_notifications");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const notifications = useMemo(() => {
    const items: Notification[] = [];

    // Recent signups (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    profiles
      .filter((p) => new Date(p.created_at) > weekAgo)
      .slice(0, 10)
      .forEach((p) => {
        items.push({
          id: `signup-${p.id}`,
          type: "signup",
          title: "New User Signup",
          description: p.full_name || "Unnamed user",
          time: p.created_at,
          read: readIds.has(`signup-${p.id}`),
        });
      });

    // Detection threshold alerts
    const diseaseCounts: Record<string, number> = {};
    detections.forEach((d) => {
      diseaseCounts[d.disease] = (diseaseCounts[d.disease] || 0) + 1;
    });
    Object.entries(diseaseCounts)
      .filter(([, count]) => count >= DETECTION_THRESHOLD)
      .forEach(([disease, count]) => {
        const id = `detection-${disease}`;
        items.push({
          id,
          type: "detection_alert",
          title: "High Detection Count",
          description: `${disease}: ${count} detections`,
          time: detections.find((d) => d.disease === disease)?.created_at || "",
          read: readIds.has(id),
        });
      });

    return items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }, [profiles, detections, readIds]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    const allIds = new Set(notifications.map((n) => n.id));
    setReadIds(allIds);
    localStorage.setItem("admin_read_notifications", JSON.stringify([...allIds]));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" side="bottom">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="font-semibold text-sm text-foreground">Notifications</p>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-auto">
          {notifications.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground">No notifications</p>
          ) : (
            notifications.slice(0, 15).map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors ${
                  n.read ? "opacity-60" : "bg-primary/5"
                }`}
              >
                <div className={`mt-0.5 p-1.5 rounded-full ${
                  n.type === "signup" ? "bg-primary/10" : "bg-destructive/10"
                }`}>
                  {n.type === "signup" ? (
                    <UserPlus className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(n.time)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default AdminNotifications;
