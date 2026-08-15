import { useState, useEffect } from 'react';
import { getPublishedProperty } from '../lib/properties';
import { PROPERTIES as STATIC_PROPERTIES } from '../data/properties';

// Normalize price string — ensure ₹ prefix is present regardless of DB encoding
function normalizePrice(price) {
  if (!price) return price;
  const cleaned = String(price).trim();
  if (cleaned.startsWith('\u20B9')) return cleaned;
  const stripped = cleaned.replace(/^[?¿\uFFFD\u003F]+/, '').trim();
  return `\u20B9${stripped}`;
}

export function useProperty(slugOrId) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slugOrId) return;
    let isMounted = true;
    setLoading(true);

    getPublishedProperty(slugOrId)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          const mapped = {
            ...data,
            heroImage: data.cover_image_url || (data.property_media && data.property_media[0]?.public_url) || '',
            images: data.property_media && data.property_media.length > 0 
              ? data.property_media.map(m => m.public_url)
              : [data.cover_image_url || ''],
            startingPrice: normalizePrice(data.starting_price),
            priceValue: data.price_value,
            pricePerSqFt: normalizePrice(data.price_per_sqft),
            bhkOptions: data.bhk_options || [],
            landParcel: data.land_parcel,
            totalUnits: data.total_units,
            towerHeight: data.tower_height,
            reraId: data.rera_id,
            reraPortalUrl: data.rera_portal_url,
            micromarketLabel: data.micromarket_label,
            propertyType: data.property_type,
            longDescription: data.long_description,
            developerLogoUrl: data.developer_logo_url,
            developerExperience: data.developer_experience,
            developerProjectsCount: data.developer_projects_count,
            developerDescription: data.developer_description,
            brochureUrl: data.brochure_url,
            masterPlanImageUrl: data.master_plan_image_url,
            walkthroughVideoUrl: data.walkthrough_video_url,
            pricingMatrix: (data.pricing_matrix || []).map(row => ({
              ...row,
              price: normalizePrice(row.price)
            })),
            possession: data.possession || '',
            configurations: data.configurations || '',
            priceRaw: data.price_value || data.starting_price || '',
            amenities: data.amenities || [],
            proximity: data.proximity || [],
            badges: data.badges || [],
            highlights: data.highlights || [],
            recentUpdates: data.recent_updates || [],
            specifications: data.specifications || [],
            priceInsights: data.price_insights || [],
            buyerPersonas: data.buyer_personas || []
          };
          setProperty(mapped);
        } else {
          const found = STATIC_PROPERTIES.find(p => p.slug === slugOrId || p.id === slugOrId);
          setProperty(found || STATIC_PROPERTIES[0]);
        }
      })
      .catch((err) => {
        console.error('Supabase query failed, falling back to static item:', err);
        if (isMounted) {
          setError(err);
          const found = STATIC_PROPERTIES.find(p => p.slug === slugOrId || p.id === slugOrId);
          setProperty(found || STATIC_PROPERTIES[0]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [slugOrId]);

  return { property, loading, error };
}
