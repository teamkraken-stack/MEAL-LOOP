// Initialize Supabase Client
const SUPABASE_URL = 'https://czhndtnqrpmpougfynsk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6aG5kdG5xcnBtcG91Z2Z5bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMjA4NDEsImV4cCI6MjEwMjg5Njg0MX0.95yb8y2CCcxK7FNfTcE4Avr0JsHitRgIgDtS8v_qEVA';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
