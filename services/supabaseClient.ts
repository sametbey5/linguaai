
import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// INSTRUCTIONS:
// 1. Go to https://supabase.com and create a new project.
// 2. Go to Project Settings (gear icon) -> API.
// 3. Copy the "Project URL" and paste it into SUPABASE_URL below.
// 4. Copy the "anon" / "public" key and paste it into SUPABASE_ANON_KEY below.
// ------------------------------------------------------------------

const SUPABASE_URL = 'https://qfrweykemupxqqozcdqj.supabase.co'; // <--- PASTE YOUR PROJECT URL HERE
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcndleWtlbXVweHFxb3pjZHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjk4MjIsImV4cCI6MjA4NjkwNTgyMn0.mLyKpt3aG_PZE6F8jEg-0I4wPPXaOVIVbxdjpSXMGUA'; // <--- PASTE YOUR ANON KEY HERE

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
