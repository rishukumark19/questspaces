import supabase from './supabase.js';

// Public: Submit a lead / inquiry
export async function submitLead(leadData) {
  if (!supabase) { console.warn('Supabase not configured — lead not saved'); return null; }
  const { data, error } = await supabase
    .from('leads')
    .insert([{
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email || '',
      property_title: leadData.propertyTitle || 'General Inquiry',
      lead_type: leadData.leadType || 'VIP Booking',
      message: leadData.message || '',
      status: 'New'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

const LOCAL_LEADS_KEY = 'questspaces_leads_data';

const DUMMY_LEADS = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
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

function getStoredLeads() {
  try {
    const saved = localStorage.getItem(LOCAL_LEADS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed reading leads from localStorage', e);
  }
  return [...DUMMY_LEADS];
}

// Admin: Fetch all leads
export async function getAllLeads(filters = {}) {
  if (supabase) {
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status && filters.status !== 'All') {
        query = query.eq('status', filters.status);
      }
      if (filters.leadType && filters.leadType !== 'All') {
        query = query.eq('lead_type', filters.leadType);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%,property_title.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        if (Array.isArray(data) && data.length === 0) throw new Error('Empty DB, use fallback');
        return data;
      }
    } catch (err) {
      console.warn('Supabase getAllLeads failed, falling back to local storage:', err);
    }
  }

  let list = getStoredLeads();
  if (filters.status && filters.status !== 'All') {
    list = list.filter(l => l.status === filters.status);
  }
  if (filters.leadType && filters.leadType !== 'All') {
    list = list.filter(l => l.lead_type === filters.leadType);
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(l => 
      (l.name && l.name.toLowerCase().includes(s)) ||
      (l.phone && l.phone.toLowerCase().includes(s)) ||
      (l.email && l.email.toLowerCase().includes(s)) ||
      (l.property_title && l.property_title.toLowerCase().includes(s))
    );
  }
  return list;
}

// Admin: Update lead status
export async function updateLeadStatus(id, status) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Admin: Update lead note
export async function updateLeadNote(id, note) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('leads')
    .update({ note })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Admin: Update lead priority
export async function updateLeadPriority(id, is_priority) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('leads')
    .update({ is_priority })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Admin: Delete lead
export async function deleteLead(id) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

