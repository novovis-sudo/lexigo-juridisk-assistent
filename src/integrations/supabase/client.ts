// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vmtrzwjjbecxnhvjajmp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtdHJ6d2pqYmVjeG5odmpham1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NjQyNTcsImV4cCI6MjA2MzU0MDI1N30.WDnyrLDitvx12thYxFDx3VrEcLARGsPdbauit26E5Qk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);