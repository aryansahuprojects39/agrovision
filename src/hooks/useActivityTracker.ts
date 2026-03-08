import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useActivityTracker = () => {
  const { user } = useAuth();

  const trackActivity = useCallback(
    async (activityType: string, metadata: Record<string, any> = {}) => {
      if (!user) return;
      try {
        await supabase.from("user_activity").insert({
          user_id: user.id,
          activity_type: activityType,
          metadata: { ...metadata, email: user.email, name: user.user_metadata?.full_name },
        });
      } catch {
        // silently fail - analytics shouldn't block UX
      }
    },
    [user]
  );

  return { trackActivity };
};
