import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf-8');
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

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyLeads = [
  {
    name: 'Rahul Khanna',
    phone: '+91 98450 12345',
    email: 'rahul.khanna@techcorp.com',
    property_title: 'L&T Realty Elara Celestia',
    lead_type: 'VIP Booking',
    message: 'Interested in a 4 BHK high-floor apartment.',
    status: 'New',
    created_at: new Date().toISOString()
  },
  {
    name: 'Sneha Patel',
    phone: '+91 97123 45678',
    email: 'sneha.p@investors.in',
    property_title: 'Embassy Astra',
    lead_type: 'VIP Booking',
    message: 'Looking for investment options in Hebbal.',
    status: 'Contacted',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    name: 'Vikram Singh',
    phone: '+91 99887 76655',
    email: 'vikram.singh@gmail.com',
    property_title: 'Aeropolis Plots',
    lead_type: 'Site Visit',
    message: 'Can I visit the site this weekend?',
    status: 'New',
    created_at: new Date().toISOString()
  },
  {
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya.sharma@design.co',
    property_title: 'Visista Villas',
    lead_type: 'General Inquiry',
    message: 'What is the exact possession date?',
    status: 'Closed',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    name: 'Amit Kumar',
    phone: '+91 91234 56789',
    email: 'amit.k@startup.io',
    property_title: 'Lodha Mirabelle',
    lead_type: 'Brochure Download',
    message: '',
    status: 'Closed',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  }
];

const dummyDrafts = [
  {
    title: 'Godrej Woods',
    slug: 'godrej-woods-draft',
    developer: 'Godrej Properties',
    location: 'Noida',
    publish_state: 'draft',
    featured: false,
    property_type: 'Apartment',
    starting_price: '₹1.5 Cr',

  },
  {
    title: 'Prestige Lakeside Habitat',
    slug: 'prestige-lakeside-habitat-draft',
    developer: 'Prestige Group',
    location: 'Bangalore',
    publish_state: 'draft',
    featured: false,
    property_type: 'Villa',
    starting_price: '₹3.2 Cr',

  }
];

async function seed() {
  console.log("Seeding leads...");
  const { error: leadsError } = await supabase.from('leads').insert(dummyLeads);
  if (leadsError) {
    console.error("Error inserting leads:", leadsError);
  } else {
    console.log("Leads inserted successfully.");
  }

  console.log("Seeding properties (drafts)...");
  const { error: propsError } = await supabase.from('properties').insert(dummyDrafts);
  if (propsError) {
    console.error("Error inserting properties:", propsError);
  } else {
    console.log("Properties inserted successfully.");
  }

  console.log("Done!");
}

seed();
