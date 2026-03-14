import { createClient } from '@supabase/supabase-js'

// Si no hay .env, se usan estos valores para no romper la app
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rleznycvhifnxvqjfcex.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GKqQQB9plG-DH9EwC7yOeA_2-oXbQG8'

export const supabase = createClient(supabaseUrl, supabaseKey)