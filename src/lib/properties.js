import supabase from './supabase.js';
import { PROPERTIES as STATIC_PROPERTIES } from '../data/properties';

// ─────────────────────────────────────────────────────
// UTILS: Normalize Price
// ─────────────────────────────────────────────────────
export function normalizePrice(price) {
  if (!price) return price;
  const cleaned = String(price).trim();
  if (cleaned.startsWith('\u20B9')) return cleaned;
  const stripped = cleaned.replace(/^[?¿\uFFFD\u003F]+/, '').trim();
  return `\u20B9${stripped}`;
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
  return (data || []).map(p => ({ ...p, starting_price: normalizePrice(p.starting_price) }));
}

// ─────────────────────────────────────────────────────
// PUBLIC: Fetch a single published property by slug
// ─────────────────────────────────────────────────────
export async function getPublishedProperty(slugOrId) {
  if (!supabase) throw new Error('Supabase not configured');
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

  let query = supabase
    .from('properties')
    .select('*, property_media(id, public_url, is_cover, display_order, media_type, thumbnail_url)')
    .eq('publish_state', 'published');

  if (isUUID) {
    query = query.eq('id', slugOrId);
  } else {
    query = query.eq('slug', slugOrId);
  }

  const { data, error } = await query.single();
  if (error) {
    const found = STATIC_PROPERTIES.find(p => p.slug === slugOrId || p.id === slugOrId);
    if (found) return { ...found, starting_price: normalizePrice(found.starting_price) };
    throw error;
  }
  return { ...data, starting_price: normalizePrice(data.starting_price) };
}

// ─────────────────────────────────────────────────────
// ADMIN: Fetch ALL properties (including drafts/archived)
// ─────────────────────────────────────────────────────
export async function getAllProperties(filters = {}) {
  if (supabase) {
    try {
      let query = supabase
        .from('properties')
        .select('id, slug, title, location, developer, seo_title, starting_price, status, publish_state, featured, cover_image_url, updated_at, property_type')
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
      if (!error && data) {
        if (Array.isArray(data) && data.length === 0) throw new Error('Empty DB, use fallback');
        return data.map(p => ({ ...p, starting_price: normalizePrice(p.starting_price) }));
      }
    } catch (err) {
      console.warn('Supabase getAllProperties failed, falling back to static data:', err);
    }
  }

  // Fallback to static properties formatted for admin
  let list = [...getLocalCache()];
  if (filters.publishState && filters.publishState !== 'All') {
    list = list.filter(p => p.publish_state === filters.publishState);
  }
  if (filters.propertyType && filters.propertyType !== 'All') {
    list = list.filter(p => p.property_type === filters.propertyType);
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(p => 
      (p.title && p.title.toLowerCase().includes(s)) ||
      (p.location && p.location.toLowerCase().includes(s))
    );
  }
  return list;
}

// Map static camelCase property to Supabase snake_case format for Admin consumption
export function mapStaticToAdminFormat(staticProp) {
  if (!staticProp) return null;
  return {
    ...staticProp,
    property_type: staticProp.propertyType,
    starting_price: normalizePrice(staticProp.startingPrice),
    price_value: staticProp.priceValue,
    price_per_sqft: staticProp.pricePerSqFt,
    bhk_options: staticProp.bhkOptions,
    land_parcel: staticProp.landParcel,
    total_units: staticProp.totalUnits,
    tower_height: staticProp.towerHeight,
    rera_id: staticProp.reraId,
    rera_portal_url: staticProp.reraPortalUrl,
    micromarket_label: staticProp.micromarketLabel,
    long_description: staticProp.longDescription,
    developer_logo_url: staticProp.developerLogoUrl,
    developer_experience: staticProp.developerExperience,
    developer_projects_count: staticProp.developerProjectsCount,
    developer_description: staticProp.developerDescription,
    full_address: staticProp.fullAddress,
    cover_image_url: staticProp.heroImage || staticProp.images?.[0] || '',
    pricing_matrix: staticProp.pricingMatrix,
    publish_state: 'published'
  };
}

let _localPropertiesCache = null;
function getLocalCache() {
  if (!_localPropertiesCache) {
    _localPropertiesCache = (STATIC_PROPERTIES || []).map(mapStaticToAdminFormat);
    
    // Add some dummy drafts for demo purposes
    _localPropertiesCache.push({
      id: 'dummy-draft-1',
      title: 'Godrej Woods',
      slug: 'godrej-woods',
      developer: 'Godrej Properties',
      location: 'Noida',
      publish_state: 'draft',
      featured: false,
      property_type: 'Apartment',
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
      property_type: 'Villa',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
    });
  }
  return _localPropertiesCache;
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
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([{ ...cleanData, publish_state: 'draft' }])
        .select()
        .single();

      if (!error && data) {
         getLocalCache().unshift({ ...data });
         return data;
      }
    } catch (err) {
      console.warn('Supabase createProperty failed:', err);
    }
  }
  
  const newProperty = { ...propertyData, id: Date.now().toString(), publish_state: 'draft', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  getLocalCache().unshift({ ...newProperty });
  return newProperty;
}

// ─────────────────────────────────────────────────────
// ADMIN: Update an existing property
// ─────────────────────────────────────────────────────
export async function updateProperty(idOrSlug, updates) {
  // Strip joined relational fields and computed counts that don't belong to the properties table
  const { property_media, leads_count, id: bodyId, ...cleanUpdates } = updates;
  
  // Try to use the actual UUID if present in the updates object
  const targetId = bodyId || idOrSlug;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);

  if (supabase) {
    try {
      let query = supabase
        .from('properties')
        .update({ ...cleanUpdates, updated_at: new Date().toISOString() });

      if (isUUID) {
        query = query.eq('id', targetId);
      } else {
        query = query.eq('slug', targetId);
      }

      const { data, error } = await query.select().single();
      if (!error && data) {
         const index = getLocalCache().findIndex(p => p.id === targetId || p.slug === targetId);
         if (index !== -1) getLocalCache()[index] = { ...getLocalCache()[index], ...cleanUpdates, updated_at: new Date().toISOString() };
         return data;
      }
    } catch (err) {
      console.warn('Supabase updateProperty failed:', err);
    }
  }

  const index = getLocalCache().findIndex(p => p.id === targetId || p.slug === targetId);
  if (index !== -1) {
    getLocalCache()[index] = { ...getLocalCache()[index], ...cleanUpdates, updated_at: new Date().toISOString() };
    return { ...getLocalCache()[index] };
  }

  return { ...updates, id: targetId, updated_at: new Date().toISOString() };
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
    console.warn('Supabase duplicateProperty failed, duplicating locally:', error);
    const newLocalProp = { ...duplicatedData, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    getLocalCache().unshift({ ...newLocalProp });
    return newLocalProp;
  }
  
  getLocalCache().unshift({ ...data });
  return data;
}

// ─────────────────────────────────────────────────────
// ADMIN: Delete property (hard delete — media cascades via FK)
// ─────────────────────────────────────────────────────
export async function deleteProperty(id) {
  if (supabase) {
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) console.warn('Supabase delete error:', error);
    } catch (err) {}
  }
  const index = getLocalCache().findIndex(p => p.id === id || p.slug === id);
  if (index !== -1) getLocalCache().splice(index, 1);
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
        if (data.length === 0) throw new Error('Empty DB, use fallback');
        const total = data.length;
        const published = data.filter(p => p.publish_state === 'published').length;
        const drafts = data.filter(p => p.publish_state === 'draft').length;
        const archived = data.filter(p => p.publish_state === 'archived').length;
        const featured = data.filter(p => p.featured).length;

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
