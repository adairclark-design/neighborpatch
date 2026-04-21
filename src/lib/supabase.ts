import { createClient } from "@supabase/supabase-js";

// Use non-null assertions (!) because we will enforce they exist in Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize the single shared browser/client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
