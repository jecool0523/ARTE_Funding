import { createClient } from '@supabase/supabase-js';

// ARTE_Funding Project Configuration
const SUPABASE_URL = 'https://uaqqsehsbmuufygaxsqm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_N3gOSUIBf2B8wdfqnI23tw_nrYpXoC2';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);