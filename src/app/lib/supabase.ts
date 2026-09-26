import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://poejtslzbtogchavlvys.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZWp0c2x6YnRvZ2NoYXZsdnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MzA1OTksImV4cCI6MjEwNTUwNjU5OX0.mvv8BXKkYKjxaghtJneyYvmE-4BsKcA0hg1kh5JD2Ng';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

