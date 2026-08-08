import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zcfdapjacuwzujlvfcri.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZmRhcGphY3V3enVqbHZmY3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MzY4MTEsImV4cCI6MjA5NzExMjgxMX0.6KmvSwjWX-vf2KLfivyfRUgrXaoti-AJ3-SAgknx05o";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export {
  supabase
};
