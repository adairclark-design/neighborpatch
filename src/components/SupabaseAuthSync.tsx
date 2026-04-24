"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SupabaseAuthSync() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session) {
          document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax; secure`;
        }
      } else if (event === "SIGNED_OUT") {
        document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
