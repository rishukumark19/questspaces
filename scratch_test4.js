import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = fs.readFileSync(path.resolve(__dirname, '.env'), 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

// Unauthenticated client (using just anon key)
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const cleanData = {
    title: 'Test Draft ' + Date.now(),
    slug: 'test-draft-' + Date.now(),
    property_type: 'Luxury Apartment',
    starting_price: '₹1 Cr*'
  };

  const { data, error } = await supabase
    .from('properties')
    .insert([{ ...cleanData, publish_state: 'draft' }])
    .select()
    .single();

  console.log("Insert Error:", error);
  console.log("Inserted Data ID:", data ? data.id : null);
}
test();
