import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rleznycvhifnxvqjfcex.supabase.co'
const supabaseKey = 'sb_publishable_GKqQQB9plG-DH9EwC7yOeA_2-oXbQG8'

export const supabase = createClient(supabaseUrl, supabaseKey)