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

// Admin: Fetch all leads
export async function getAllLeads(filters = {}) {
  if (!supabase) throw new Error('Supabase not configured');
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
  if (error) throw error;
  return data || [];
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

