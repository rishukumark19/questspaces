import supabase from './supabase.js';

export const STATIC_TESTIMONIALS = [
  {
    id: '1',
    name: 'Priya Sharma',
    title: 'Tech Executive & Investor',
    quote: 'The market analysis and guidance provided by Quest Spaces was incredible. They helped me secure an off-market luxury apartment in Hebbal that fits my family perfectly and aligns with my investment goals.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    status: 'published',
    display_order: 1,
    created_at: new Date('2026-02-10').toISOString()
  },
  {
    id: '2',
    name: 'Vikram Reddy',
    title: 'NRI Investor, Dubai',
    quote: 'I was looking for a high-yield asset in North Bengaluru. The advisory desk mapped out the KIADB tech park corridor and found a plotted development that appreciated 18% in just 10 months.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    status: 'published',
    display_order: 2,
    created_at: new Date('2026-01-22').toISOString()
  },
  {
    id: '3',
    name: 'Anjali Desai',
    title: 'First-Time Homebuyer',
    quote: 'Professional, transparent, and extremely knowledgeable about Karnataka RERA norms. They made our transition from Mumbai to Bengaluru completely seamless.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    status: 'published',
    display_order: 3,
    created_at: new Date('2025-12-05').toISOString()
  }
];

const LOCAL_STORAGE_KEY = 'questspaces_testimonials_data';

function getStoredTestimonials() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed reading testimonials from localStorage', e);
  }
  return [...STATIC_TESTIMONIALS];
}

function setStoredTestimonials(testimonials) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(testimonials));
  } catch (e) {
    console.error('Failed saving testimonials to localStorage', e);
  }
}

// ─────────────────────────────────────────────────────
// Fetch all testimonials (for public & admin views)
// ─────────────────────────────────────────────────────
export async function getAllTestimonials(filters = {}) {
  if (supabase) {
    try {
      let query = supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (filters.status && filters.status !== 'All') {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,title.ilike.%${filters.search}%,quote.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase testimonials query failed, falling back to local state:', err);
    }
  }

  // Local storage fallback
  let items = getStoredTestimonials();
  if (filters.status && filters.status !== 'All') {
    items = items.filter(t => t.status === filters.status);
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    items = items.filter(t => 
      (t.name && t.name.toLowerCase().includes(s)) ||
      (t.title && t.title.toLowerCase().includes(s)) ||
      (t.quote && t.quote.toLowerCase().includes(s))
    );
  }
  return items;
}

// ─────────────────────────────────────────────────────
// Create new testimonial
// ─────────────────────────────────────────────────────
export async function createTestimonial(testimonialData) {
  const newRecord = {
    id: Date.now().toString(),
    name: testimonialData.name || '',
    title: testimonialData.title || '',
    quote: testimonialData.quote || '',
    image: testimonialData.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    rating: Number(testimonialData.rating) || 5,
    status: testimonialData.status || 'published',
    display_order: Number(testimonialData.display_order) || 1,
    created_at: new Date().toISOString(),
    ...testimonialData
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([newRecord])
        .select()
        .single();
      if (!error && data) {
        // Also sync local
        const current = getStoredTestimonials();
        setStoredTestimonials([data, ...current]);
        return data;
      }
    } catch (err) {
      console.warn('Supabase createTestimonial failed, saving to local storage:', err);
    }
  }

  const current = getStoredTestimonials();
  const updated = [newRecord, ...current];
  setStoredTestimonials(updated);
  return newRecord;
}

// ─────────────────────────────────────────────────────
// Update testimonial
// ─────────────────────────────────────────────────────
export async function updateTestimonial(id, updates) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        const current = getStoredTestimonials();
        const updated = current.map(t => t.id === id ? { ...t, ...data } : t);
        setStoredTestimonials(updated);
        return data;
      }
    } catch (err) {
      console.warn('Supabase updateTestimonial failed, saving to local storage:', err);
    }
  }

  const current = getStoredTestimonials();
  const index = current.findIndex(t => String(t.id) === String(id));
  if (index === -1) throw new Error('Testimonial not found');
  
  const updatedItem = { ...current[index], ...updates };
  current[index] = updatedItem;
  setStoredTestimonials(current);
  return updatedItem;
}

// ─────────────────────────────────────────────────────
// Delete testimonial
// ─────────────────────────────────────────────────────
export async function deleteTestimonial(id) {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      if (error) {
        console.warn('Supabase deleteTestimonial failed:', error);
      }
    } catch (err) {
      console.warn('Supabase deleteTestimonial error:', err);
    }
  }

  const current = getStoredTestimonials();
  const filtered = current.filter(t => String(t.id) !== String(id));
  setStoredTestimonials(filtered);
  return true;
}
