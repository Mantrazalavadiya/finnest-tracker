import { createClient } from '@supabase/supabase-js';

// Base project URL without /rest/v1/ or any trailing slash
const supabaseUrl = 'https://gomljwyebcldbhderyni.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);