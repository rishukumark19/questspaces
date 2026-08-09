import supabase from './supabase.js';

// ─────────────────────────────────────────────────────
// PUBLIC: Fetch all published properties (with optional filters)
// ─────────────────────────────────────────────────────
export async function getPublishedProperties(filters = {}) {
  if (!supabase) throw new Error('Supabase not configured');
  let query = supabase
    .from('properties')
    .select('*, property_media(id, public_url, is_cover, display_order, media_type)')
    .eq('publish_state', 'published')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters.micromarket && filters.micromarket !== 'All') {
    query = query.ilike('micromarket', `%${filters.micromarket}%`);
  }
  if (filters.propertyType && filters.propertyType !== 'All') {
    query = query.eq('property_type', filters.propertyType);
  }
  if (filters.status && filters.status !== 'All') {
    query = query.ilike('status', `%${filters.status}%`);
  }
  if (filters.maxPrice) {
    query = query.lte('price_value', filters.maxPrice * 100000);
  }
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%,developer.ilike.%${filters.search}%,micromarket.ilike.%${filters.search}%`);
  }
  if (filters.bhk && filters.bhk !== 'All') {
    query = query.contains('bhk_options', [filters.bhk]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// ─────────────────────────────────────────────────────
// PUBLIC: Fetch a single published property by slug
// ─────────────────────────────────────────────────────
export async function getPublishedProperty(slug) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_media(id, public_url, is_cover, display_order, media_type, thumbnail_url)')
    .eq('slug', slug)
    .eq('publish_state', 'published')
    .single();

  if (error) throw error;
  return data;
}

// ─────────────────────────────────────────────────────
// ADMIN: Fetch ALL properties (including drafts/archived)
// ─────────────────────────────────────────────────────
export async function getAllProperties(filters = {}) {
  if (!supabase) throw new Error('Supabase not configured');
  let query = supabase
    .from('properties')
    .select('id, slug, title, location, starting_price, status, publish_state, featured, cover_image_url, updated_at, property_type')
    .order('updated_at', { ascending: false });

  if (filters.publishState && filters.publishState !== 'All') {
    query = query.eq('publish_state', filters.publishState);
  }
  if (filters.propertyType && filters.propertyType !== 'All') {
    query = query.eq('property_type', filters.propertyType);
  }
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// ─────────────────────────────────────────────────────
// ADMIN: Fetch single property (any state) by ID
// ─────────────────────────────────────────────────────
export async function getPropertyById(id) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_media(id, public_url, is_cover, display_order, media_type, thumbnail_url, storage_path)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// ─────────────────────────────────────────────────────
// ADMIN: Create a new property (as draft)
// ─────────────────────────────────────────────────────
export async function createProperty(propertyData) {
  const { data, error } = await supabase
    .from('properties')
    .insert([{ ...propertyData, publish_state: 'draft' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─────────────────────────────────────────────────────
// ADMIN: Update an existing property
// ─────────────────────────────────────────────────────
export async function updateProperty(id, updates) {
  const { data, error } = await supabase
    .from('properties')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─────────────────────────────────────────────────────
// ADMIN: Publish a property (with validation)
// ─────────────────────────────────────────────────────
export function validateForPublish(property) {
  const required = [
    { field: 'title', label: 'Property name' },
    { field: 'property_type', label: 'Property type' },
    { field: 'location', label: 'Location' },
    { field: 'starting_price', label: 'Starting price' },
    { field: 'description', label: 'Description' },
    { field: 'cover_image_url', label: 'Cover photo' },
  ];
  const missing = required.filter(r => !property[r.field]).map(r => r.label);
  return { valid: missing.length === 0, missing };
}

export async function publishProperty(id, propertyData) {
  const validation = validateForPublish(propertyData);
  if (!validation.valid) {
    throw new Error(`Cannot publish. Please complete: ${validation.missing.join(', ')}`);
  }
  return updateProperty(id, { publish_state: 'published' });
}

export async function unpublishProperty(id) {
  return updateProperty(id, { publish_state: 'archived' });
}

// ─────────────────────────────────────────────────────
// ADMIN: Duplicate an existing property as a draft
// ─────────────────────────────────────────────────────
export async function duplicateProperty(id) {
  const original = await getPropertyById(id);
  if (!original) throw new Error('Original property not found');

  const newTitle = `${original.title} (Copy)`;
  const newSlug = generateSlug(`${original.slug}-copy-${Date.now().toString().slice(-4)}`);

  const { id: _oldId, created_at: _c, updated_at: _u, property_media: _m, ...cleanData } = original;

  const duplicatedData = {
    ...cleanData,
    title: newTitle,
    slug: newSlug,
    publish_state: 'draft',
    featured: false,
  };

  const { data, error } = await supabase
    .from('properties')
    .insert([duplicatedData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─────────────────────────────────────────────────────
// ADMIN: Delete property (hard delete — media cascades via FK)
// ─────────────────────────────────────────────────────
export async function deleteProperty(id) {
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────
// ADMIN: Dashboard stats
// ─────────────────────────────────────────────────────
export async function getPropertyStats() {
  const { data, error } = await supabase
    .from('properties')
    .select('publish_state, featured');

  if (error) throw error;
  
  const total = data.length;
  const published = data.filter(p => p.publish_state === 'published').length;
  const drafts = data.filter(p => p.publish_state === 'draft').length;
  const archived = data.filter(p => p.publish_state === 'archived').length;
  const featured = data.filter(p => p.featured).length;

  return { total, published, drafts, archived, featured };
}

// ─────────────────────────────────────────────────────
// HELPER: Generate a slug from a title
// ─────────────────────────────────────────────────────
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}
