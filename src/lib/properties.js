import supabase from './supabase.js';
import { PROPERTIES as STATIC_PROPERTIES } from '../data/properties';

// ─────────────────────────────────────────────────────
// UTILS: Normalize Price
// ─────────────────────────────────────────────────────
export function normalizePrice(price) {
  if (!price) return price;
  const cleaned = String(price).trim();
  if (cleaned.startsWith('₹')) return cleaned;
  const stripped = cleaned.replace(/^[?¿?]+/, '').trim();
  return `₹${stripped}`;
}

export function normalizeProperty(p) {
  if (!p) return null;
  const media = p.property_media || [];
  const imageMedia = media.filter(m => m.media_type !== 'video');
  const videoMedia = media.filter(m => m.media_type === 'video');

  const coverUrl = p.cover_image_url || (imageMedia.length > 0 ? imageMedia[0].public_url : '') || (p.images && p.images[0]) || '';
  const allImages = imageMedia.length > 0 
    ? imageMedia.map(m => m.public_url) 
    : (p.images && p.images.length > 0 ? p.images : [coverUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80']);

  const videoUrl = p.walkthrough_video_url || p.walkthroughVideoUrl || (videoMedia.length > 0 ? videoMedia[0].public_url : '') || '';

  return {
    ...p,
    heroImage: coverUrl,
    images: allImages,
    walkthroughVideoUrl: videoUrl,
    walkthrough_video_url: videoUrl,
    startingPrice: normalizePrice(p.starting_price || p.price),
    priceValue: p.price_value || p.priceValue,
    pricePerSqFt: normalizePrice(p.price_per_sqft || p.pricePerSqFt),
    bhkOptions: p.bhk_options || p.bhkOptions || [],
    landParcel: p.land_parcel || p.landParcel || '',
    totalUnits: p.total_units || p.totalUnits || '',
    towerHeight: p.tower_height || p.towerHeight || '',
    reraId: p.rera_id || p.reraId || '',
    reraPortalUrl: p.rera_portal_url || p.reraPortalUrl || '',
    micromarketLabel: p.micromarket_label || p.micromarketLabel || p.micromarket || '',
    propertyType: p.property_type || p.propertyType || '',
    longDescription: p.long_description || p.longDescription || p.description || '',
    developerLogoUrl: p.developer_logo_url || p.developerLogoUrl || '',
    developerExperience: p.developer_experience || p.developerExperience || '',
    developerProjectsCount: p.developer_projects_count || p.developerProjectsCount || '',
    developerDescription: p.developer_description || p.developerDescription || '',
    brochureUrl: p.brochure_url || p.brochureUrl || '',
    masterPlanImageUrl: p.master_plan_image_url || p.masterPlanImageUrl || '',
    pricingMatrix: (p.pricing_matrix || p.pricingMatrix || []).map(row => ({
      ...row,
      price: normalizePrice(row.price)
    })),
    possession: p.possession || '',
    configurations: p.configurations || '',
    priceRaw: p.price_value || p.priceValue || p.starting_price || p.price || '',
    amenities: p.amenities || [],
    proximity: p.proximity || [],
    badges: p.badges || [],
    highlights: p.highlights || [],
    recentUpdates: p.recent_updates || p.recentUpdates || [],
    specifications: p.specifications || [],
    priceInsights: p.price_insights || p.priceInsights || [],
    buyerPersonas: p.buyer_personas || p.buyerPersonas || [],
    floorPlans: p.floor_plans || p.floorPlans || []
  };
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

export function toAdminProperty(p) {
  if (!p) return null;
  
  // If this property corresponds to a static property, merge the base static data first!
  const baseStatic = (p.id || p.slug) 
    ? (STATIC_PROPERTIES.find(sp => sp.id === p.id || sp.slug === p.slug || (p.id === 'dummy-draft-1' && sp.slug === 'godrej-woods') || (p.id === 'dummy-draft-2' && sp.slug === 'prestige-lakeside-habitat')) || {})
    : {};

  const merged = { ...baseStatic, ...p };

  const media = merged.property_media || [];
  const imageMedia = media.filter(m => m.media_type !== 'video');
  const videoMedia = media.filter(m => m.media_type === 'video');

  const coverUrl = merged.cover_image_url || (imageMedia.length > 0 ? imageMedia[0].public_url : '') || (merged.images && merged.images[0]) || merged.heroImage || '';
  const allImages = imageMedia.length > 0
    ? imageMedia.map(m => m.public_url)
    : (merged.images && merged.images.length > 0 ? merged.images : (coverUrl ? [coverUrl] : []));

  const videoUrl = merged.walkthrough_video_url || merged.walkthroughVideoUrl || (videoMedia.length > 0 ? videoMedia[0].public_url : '') || '';

  const shortDesc = merged.description || merged.overview || baseStatic.description || baseStatic.overview || '';
  const longDesc = merged.long_description || merged.longDescription || merged.description || baseStatic.longDescription || baseStatic.description || '';
  const constructionStatus = merged.construction_status || merged.status || baseStatic.status || 'Under Construction';

  return {
    id: merged.id || '',
    title: merged.title || baseStatic.title || '',
    slug: merged.slug || baseStatic.slug || '',
    developer: merged.developer || baseStatic.developer || '',
    location: merged.location || baseStatic.location || '',
    property_type: merged.property_type || merged.propertyType || baseStatic.propertyType || 'Luxury Apartment',
    status: constructionStatus,
    construction_status: constructionStatus,
    starting_price: normalizePrice(merged.starting_price || merged.price || baseStatic.price || ''),
    price_value: merged.price_value || merged.priceValue || baseStatic.priceValue || 0,
    price_per_sqft: merged.price_per_sqft || merged.pricePerSqFt || baseStatic.pricePerSqFt || '',
    bhk_options: (merged.bhk_options && merged.bhk_options.length > 0) ? merged.bhk_options : (merged.bhkOptions && merged.bhkOptions.length > 0 ? merged.bhkOptions : (baseStatic.bhkOptions || ['2 BHK', '3 BHK', '4 BHK'])),
    configurations: merged.configurations || (merged.bhk_options ? merged.bhk_options.join(', ') : (baseStatic.configurations || '')),
    carpet_area: merged.carpet_area || merged.carpetArea || baseStatic.carpetArea || '1,450 sq.ft.',
    super_area: merged.super_area || merged.superArea || baseStatic.superArea || '1,890 sq.ft.',
    land_parcel: merged.land_parcel || merged.landParcel || baseStatic.landParcel || '',
    total_units: merged.total_units || merged.totalUnits || baseStatic.totalUnits || '',
    tower_height: merged.tower_height || merged.towerHeight || baseStatic.towerHeight || '',
    rera_id: merged.rera_id || merged.reraId || baseStatic.reraId || '',
    rera_portal_url: merged.rera_portal_url || merged.reraPortalUrl || baseStatic.reraPortalUrl || '',
    micromarket: merged.micromarket || baseStatic.micromarket || '',
    micromarket_label: merged.micromarket_label || merged.micromarketLabel || baseStatic.micromarketLabel || merged.micromarket || '',
    overview: shortDesc,
    description: shortDesc,
    long_description: longDesc,
    full_address: merged.full_address || merged.fullAddress || (merged.location ? `${merged.location}, Bengaluru` : ''),
    map_coordinates: merged.map_coordinates || merged.mapCoordinates || '13.0358, 77.5970',
    developer_logo_url: merged.developer_logo_url || merged.developerLogoUrl || baseStatic.developerLogoUrl || '',
    developer_experience: merged.developer_experience || merged.developerExperience || baseStatic.developerExperience || '25+ Years',
    developer_projects_count: merged.developer_projects_count || merged.developerProjectsCount || baseStatic.developerProjectsCount || '40+ Projects',
    developer_description: merged.developer_description || merged.developerDescription || baseStatic.developerDescription || '',
    brochure_url: merged.brochure_url || merged.brochureUrl || baseStatic.brochureUrl || '',
    master_plan_image_url: merged.master_plan_image_url || merged.masterPlanImageUrl || baseStatic.masterPlanImageUrl || '',
    walkthrough_video_url: videoUrl,
    cover_image_url: coverUrl,
    pricing_matrix: (merged.pricing_matrix && merged.pricing_matrix.length > 0) ? merged.pricing_matrix : (baseStatic.pricingMatrix || []),
    amenities: (merged.amenities && merged.amenities.length > 0) ? merged.amenities : (baseStatic.amenities || []),
    proximity: (merged.proximity && merged.proximity.length > 0) ? merged.proximity : (baseStatic.proximity || []),
    badges: (merged.badges && merged.badges.length > 0) ? merged.badges : (baseStatic.badges || []),
    highlights: (merged.highlights && merged.highlights.length > 0) ? merged.highlights : (baseStatic.highlights || []),
    recent_updates: (merged.recent_updates && merged.recent_updates.length > 0) ? merged.recent_updates : (baseStatic.recentUpdates || []),
    specifications: (merged.specifications && merged.specifications.length > 0) ? merged.specifications : (baseStatic.specifications || []),
    price_insights: (merged.price_insights && merged.price_insights.length > 0) ? merged.price_insights : (baseStatic.priceInsights || []),
    buyer_personas: (merged.buyer_personas && merged.buyer_personas.length > 0) ? merged.buyer_personas : (baseStatic.buyerPersonas || []),
    floor_plans: (merged.floor_plans && merged.floor_plans.length > 0) ? merged.floor_plans : (baseStatic.floorPlans || []),
    publish_state: merged.publish_state || 'draft',
    featured: merged.featured ?? false,
    seo_title: merged.seo_title || (merged.title ? `${merged.title} | Luxury Real Estate` : ''),
    seo_description: merged.seo_description || shortDesc || '',
    seo_keywords: merged.seo_keywords || '',
    created_at: merged.created_at || new Date().toISOString(),
    updated_at: merged.updated_at || new Date().toISOString(),
    property_media: media.length > 0 ? media : allImages.map((img, i) => ({ id: `img-${i}`, public_url: img, media_type: 'image', is_cover: i === 0, display_order: i }))
  };
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
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        _localPropertiesCache = parsed.map(p => toAdminProperty(p));
        return _localPropertiesCache;
      }
    } catch (e) {
      console.warn('Local properties cache corrupted, resetting.');
    }
  }
  
  _localPropertiesCache = [];
  if (STATIC_PROPERTIES && STATIC_PROPERTIES.length > 0) {
    STATIC_PROPERTIES.forEach((sp, idx) => {
      _localPropertiesCache.push(toAdminProperty({
        ...sp,
        id: sp.id || `dummy-draft-${idx + 1}`,
        publish_state: idx === 0 || idx === 1 ? 'draft' : 'published',
      }));
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
  const pState = filters.publishState ? String(filters.publishState).toLowerCase() : 'all';
  const pType = filters.propertyType && filters.propertyType !== 'All' ? filters.propertyType : null;
  const searchTerm = filters.search ? String(filters.search).toLowerCase().trim() : '';

  let dbProps = [];
  if (supabase) {
    try {
      let query = supabase
        .from('properties')
        .select('*, property_media(id, public_url, is_cover, display_order, media_type)')
        .order('created_at', { ascending: false });

      if (pState !== 'all') {
        query = query.eq('publish_state', pState);
      }
      if (pType) {
        query = query.eq('property_type', pType);
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
  if (pState !== 'all') {
    localProps = localProps.filter(p => (p.publish_state || 'draft').toLowerCase() === pState);
  }
  if (pType) {
    localProps = localProps.filter(p => (p.property_type || p.propertyType) === pType);
  }

  const localOnly = localProps.filter(lp => !dbProps.some(dp => dp.id === lp.id));
  let merged = [...dbProps, ...localOnly];

  if (searchTerm) {
    merged = merged.filter(p => 
      (p.title && p.title.toLowerCase().includes(searchTerm)) ||
      (p.location && p.location.toLowerCase().includes(searchTerm)) ||
      (p.developer && p.developer.toLowerCase().includes(searchTerm)) ||
      (p.slug && p.slug.toLowerCase().includes(searchTerm))
    );
  }

  return merged.map(p => toAdminProperty(p));
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
      if (!error && data) return toAdminProperty(data);
    } catch (err) {
      console.warn('Supabase getPropertyById failed, checking local cache & static properties:', err);
    }
  }

  const cache = getLocalCache();
  const found = cache.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (found) return toAdminProperty(found);

  const staticFound = STATIC_PROPERTIES.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (staticFound) return toAdminProperty(staticFound);

  throw new Error(`Property "${idOrSlug}" not found`);
}

// ─────────────────────────────────────────────────────
// ADMIN: Create a new property (as draft)
// ─────────────────────────────────────────────────────
export async function createProperty(propertyData) {
  const { property_media, leads_count, id: _id, ...cleanData } = propertyData;
  const newProperty = toAdminProperty({
    ...cleanData,
    id: `prop-${Date.now()}`,
    publish_state: 'draft'
  });

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([{ ...cleanData, publish_state: 'draft' }])
        .select()
        .single();

      if (!error && data) {
        const cache = getLocalCache();
        cache.unshift(toAdminProperty(data));
        saveLocalCache(cache);
        return toAdminProperty(data);
      }
    } catch (err) {
      console.warn('Supabase createProperty error, saving to local cache:', err);
    }
  }

  const cache = getLocalCache();
  cache.unshift(newProperty);
  saveLocalCache(cache);
  return newProperty;
}

// ─────────────────────────────────────────────────────
// ADMIN: Update an existing property
// ─────────────────────────────────────────────────────
export async function updateProperty(idOrSlug, updates) {
  const { property_media, leads_count, id: bodyId, ...cleanUpdates } = updates;
  const targetId = bodyId || idOrSlug;

  // 1. Update local cache immediately
  const cache = getLocalCache();
  const index = cache.findIndex(p => p.id === targetId || p.slug === targetId);
  const updatedItem = toAdminProperty({
    ...(index !== -1 ? cache[index] : {}),
    ...cleanUpdates,
    id: targetId,
    updated_at: new Date().toISOString()
  });

  if (index !== -1) {
    cache[index] = updatedItem;
  } else {
    cache.unshift(updatedItem);
  }
  saveLocalCache(cache);

  // 2. If Supabase is connected, update remote DB
  if (supabase) {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
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
        return toAdminProperty(data);
      }
    } catch (err) {
      console.warn('Supabase update failed, saved locally:', err);
    }
  }

  return updatedItem;
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
