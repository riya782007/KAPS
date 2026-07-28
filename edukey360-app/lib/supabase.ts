import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client. Returns null when env is not configured,
// so the app gracefully falls back to mock data (demo never breaks).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
export const usingSupabase = !!supabase;
