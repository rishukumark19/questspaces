import supabase from './supabase.js';
import { PROPERTIES as STATIC_PROPERTIES } from '../data/properties';

// ─────────────────────────────────────────────────────
// UTILS: Normalize Price
// ─────────────────────────────────────────────────────
export function normalizePrice(price) {
  if (!price) return price;
  const cleaned = String(price).trim();
  if (cleaned.startsWith('₹')) return cleaned;
  const stripped = cleaned.replace(/^[?¿�?]+/, '').trim();
  return `₹${stripped}`;
}

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
  if (filters.property_type && filters.property_type !== 'All') {
    query = query.eq('property_type', filters.property_type);
  }
  if (filters.status && filters.status !== 'All') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  return data.map(p => ({
    ...p,
    starting_price: normalizePrice(p.starting_price)
  }));
}

// ─────────────────────────────────────────────────────
// PUBLIC: Fetch single published property by ID or Slug
// ─────────────────────────────────────────────────────
export async function getPublishedProperty(slugOrId) {
  if (supabase) {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

      let query = supabase
        .from('properties')
        .select('*, property_media(id, public_url, is_cover, display_order, media_type, thumbnail_url, storage_path)')
        .eq('publish_state', 'published');

      if (isUUID) {
        query = query.eq('id', slugOrId);
      } else {
        query = query.eq('slug', slugOrId);
      }

      const { data, error } = await query.single();
      if (!error && data) {
        return {
          ...data,
          starting_price: normalizePrice(data.starting_price)
        };
      }
    } catch (err) {
      console.warn('Supabase getPublishedProperty failed, falling back to static properties:', err);
    }
  }

  const found = STATIC_PROPERTIES.find(p => p.id === slugOrId || p.slug === slugOrId);
  if (found) {
    return {
      ...found,
      starting_price: normalizePrice(found.starting_price || found.price)
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────
// ADMIN: Fetch all properties (including drafts)
// ─────────────────────────────────────────────────────
let _localPropertiesCache = null;

function getLocalCache() {
  if (_localPropertiesCache) return _localPropertiesCache;
  const saved = localStorage.getItem('questspaces_local_properties');
  if (saved) {
    try {
      _localPropertiesCache = JSON.parse(saved);
      return _localPropertiesCache;
    } catch (e) {
      console.warn('Local properties cache corrupted, resetting.');
    }
  }
  
  _localPropertiesCache = [];
  if (STATIC_PROPERTIES && STATIC_PROPERTIES.length > 0) {
    _localPropertiesCache.push({
      id: 'dummy-draft-1',
      title: 'Godrej Woods',
      slug: 'godrej-woods',
      developer: 'Godrej Properties',
      location: 'Noida',
      publish_state: 'draft',
      featured: false,
      property_type: 'Luxury Apartment',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    });
    _localPropertiesCache.push({
      id: 'dummy-draft-2',
      title: 'Prestige Lakeside Habitat',
      slug: 'prestige-lakeside-habitat',
      developer: 'Prestige Group',
      location: 'Bangalore',
      publish_state: 'draft',
      featured: false,
      property_type: 'Modern Villa',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
    });
    
    saveLocalCache(_localPropertiesCache);
  }
  return _localPropertiesCache;
}

function saveLocalCache(cache) {
  _localPropertiesCache = cache;
  localStorage.setItem('questspaces_local_properties', JSON.stringify(cache));
}

export async function getAllProperties(filters = {}) {
  let dbProps = [];
  if (supabase) {
    try {
      let query = supabase
        .from('properties')
        .select('*, property_media(id, public_url, is_cover, display_order, media_type)')
        .order('created_at', { ascending: false });

      if (filters.publishState && filters.publishState !== 'all') {
        query = query.eq('publish_state', filters.publishState);
      }
      
      const { data, error } = await query;
      if (!error && data) {
        dbProps = data;
      }
    } catch (err) {
      console.warn('Supabase getAllProperties failed:', err);
    }
  }

  let localProps = getLocalCache();
  if (filters.publishState && filters.publishState !== 'all') {
    localProps = localProps.filter(p => p.publish_state === filters.publishState);
  }

  const localOnly = localProps.filter(lp => !dbProps.some(dp => dp.id === lp.id));
  const merged = [...dbProps, ...localOnly];

  return merged.map(p => ({
    ...p,
    starting_price: normalizePrice(p.starting_price)
  }));
}

// ─────────────────────────────────────────────────────
// ADMIN: Fetch single property (any state) by ID
// ─────────────────────────────────────────────────────
export async function getPropertyById(idOrSlug) {
  if (supabase) {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

      let query = supabase
        .from('properties')
        .select('*, property_media(id, public_url, is_cover, display_order, media_type, thumbnail_url, storage_path)');

      if (isUUID) {
        query = query.eq('id', idOrSlug);
      } else {
        query = query.eq('slug', idOrSlug);
      }

      const { data, error } = await query.single();
      if (!error && data) return { ...data, starting_price: normalizePrice(data.starting_price) };
    } catch (err) {
      console.warn('Supabase getPropertyById failed, checking static properties:', err);
    }
  }

  const found = getLocalCache().find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (found) return { ...found, starting_price: normalizePrice(found.starting_price) };
  throw new Error(`Property "${idOrSlug}" not found`);
}

// ─────────────────────────────────────────────────────
// ADMIN: Create a new property (as draft)
// ─────────────────────────────────────────────────────
export async function createProperty(propertyData) {
  const { property_media, leads_count, id: _id, ...cleanData } = propertyData;
  if (!supabase) {
    throw new Error('Supabase is not configured. Cannot create properties offline.');
  }

  const { data, error } = await supabase
    .from('properties')
    .insert([{ ...cleanData, publish_state: 'draft' }])
    .select()
    .single();

  if (error) {
    console.error('Supabase createProperty error:', error);
    throw new Error(error.message || 'Failed to create property in database');
  }

  if (data) {
    const cache = getLocalCache();
    cache.unshift({ ...data });
    saveLocalCache(cache);
    return data;
  }
  
  throw new Error('Failed to create property');
}

// ─────────────────────────────────────────────────────
// ADMIN: Update an existing property
// ─────────────────────────────────────────────────────
export async function updateProperty(idOrSlug, updates) {
  const { property_media, leads_count, id: bodyId, ...cleanUpdates } = updates;
  
  const targetId = bodyId || idOrSlug;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);

  if (!supabase) {
    throw new Error('Supabase is not configured. Cannot update properties offline.');
  }

  let query = supabase
    .from('properties')
    .update({ ...cleanUpdates, updated_at: new Date().toISOString() });

  if (isUUID) {
    query = query.eq('id', targetId);
  } else {
    query = query.eq('slug', targetId);
  }

  const { data, error } = await query.select().single();
  
  if (error) {
    console.error('Supabase updateProperty error:', error);
    throw new Error(error.message || 'Failed to update property in database');
  }

  if (data) {
     const cache = getLocalCache();
     const index = cache.findIndex(p => p.id === targetId || p.slug === targetId);
     if (index !== -1) {
        cache[index] = { ...cache[index], ...cleanUpdates, updated_at: new Date().toISOString() };
        saveLocalCache(cache);
     }
     return data;
  }
  
  throw new Error('Failed to update property');
}

// ─────────────────────────────────────────────────────
// ADMIN: Publish a property (with validation)
// ─────────────────────────────────────────────────────
export function validateForPublish(property) {
  const required = [
    { field: 'title', label: 'Property name' },
    { field: 'property_type', label: 'Property type' },
    { field: 'location', label: 'Location' },
    { field: 'developer', label: 'Developer/Builder' },
    { field: 'starting_price', label: 'Starting price' },
    { field: 'slug', label: 'URL Slug' },
    { field: 'seo_title', label: 'SEO Title' },
    { field: 'cover_image_url', label: 'Hero Image' },
  ];
  const results = required.map(r => {
    const val = property[r.field];
    const isPass = val !== undefined && val !== null && String(val).trim() !== '';
    return { ...r, isPass };
  });
  const missing = results.filter(r => !r.isPass).map(r => r.label);
  return { valid: missing.length === 0, missing, results };
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
  if (!supabase) throw new Error('Supabase is not configured.');

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

  if (error) {
    console.error('Supabase duplicateProperty error:', error);
    throw new Error(error.message || 'Failed to duplicate property');
  }
  
  const cache = getLocalCache();
  cache.unshift({ ...data });
  saveLocalCache(cache);
  return data;
}

// ─────────────────────────────────────────────────────
// ADMIN: Delete property (hard delete - media cascades via FK)
// ─────────────────────────────────────────────────────
export async function deleteProperty(id) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) {
    console.error('Supabase delete error:', error);
    throw new Error(error.message || 'Failed to delete property');
  }

  const cache = getLocalCache();
  const index = cache.findIndex(p => p.id === id || p.slug === id);
  if (index !== -1) {
    cache.splice(index, 1);
    saveLocalCache(cache);
  }
}

// ─────────────────────────────────────────────────────
// ADMIN: Dashboard stats
// ─────────────────────────────────────────────────────
export async function getPropertyStats() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('publish_state, featured');

      if (!error && data) {
        const localOnly = getLocalCache().filter(lp => !data.some(dp => dp.id === lp.id));
        const all = [...data, ...localOnly];

        if (all.length === 0) throw new Error('Empty DB, use fallback');
        
        const total = all.length;
        const published = all.filter(p => p.publish_state === 'published').length;
        const drafts = all.filter(p => p.publish_state === 'draft').length;
        const archived = all.filter(p => p.publish_state === 'archived').length;
        const featured = all.filter(p => p.featured).length;

        return { total, published, drafts, archived, featured };
      }
    } catch (err) {
      console.warn('Supabase getPropertyStats failed, using static counts:', err);
    }
  }
  
  const all = getLocalCache();
  const total = all.length;
  const published = all.filter(p => p.publish_state === 'published').length;
  const drafts = all.filter(p => p.publish_state === 'draft').length;
  const archived = all.filter(p => p.publish_state === 'archived').length;
  const featured = all.filter(p => p.featured).length;

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
