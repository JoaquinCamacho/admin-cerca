import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lhbklpwdmsopxvpxgfgx.supabase.co/rest/v1/'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoYmtscHdkbXNvcHh2cHhnZmd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNjA3NDMsImV4cCI6MjEwMTkzNjc0M30.ZsDfOhhAVsUWSmtl8onRGNB1PFIHDyp8zn-tkLyCiv8'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)