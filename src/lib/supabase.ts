import { createClient } from "@supabase/supabase-js";

// Provide fallback strings during the build step so Next.js doesn't crash if Vercel is missing the keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://stub-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "stub-key";

// Initialize the single shared browser/client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
