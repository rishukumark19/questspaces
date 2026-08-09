import { useState, useEffect } from 'react';
import { getPublishedProperties } from '../lib/properties';
import { PROPERTIES as STATIC_PROPERTIES } from '../data/properties';

export function useProperties(filters = {}) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getPublishedProperties(filters)
      .then((data) => {
        if (!isMounted) return;
        if (data && data.length > 0) {
          // Normalize media structure for public components
          const mapped = data.map(p => ({
            ...p,
            heroImage: p.cover_image_url || (p.property_media && p.property_media[0]?.public_url) || '',
            images: p.property_media && p.property_media.length > 0 
              ? p.property_media.map(m => m.public_url)
              : [p.cover_image_url || ''],
            startingPrice: p.starting_price,
            priceValue: p.price_value,
            pricePerSqFt: p.price_per_sqft,
            bhkOptions: p.bhk_options || [],
            landParcel: p.land_parcel,
            totalUnits: p.total_units,
            towerHeight: p.tower_height,
            reraId: p.rera_id,
            micromarketLabel: p.micromarket_label,
            propertyType: p.property_type,
            longDescription: p.long_description,
            pricingMatrix: p.pricing_matrix || [],
            amenities: p.amenities || [],
            proximity: p.proximity || [],
            badges: p.badges || [],
            highlights: p.highlights || []
          }));
          setProperties(mapped);
        } else {
          // Fallback to static properties if table empty
          setProperties(STATIC_PROPERTIES);
        }
      })
      .catch((err) => {
        console.error('Supabase query failed, falling back to static data:', err);
        if (isMounted) {
          setError(err);
          setProperties(STATIC_PROPERTIES);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [JSON.stringify(filters)]);

  return { properties, loading, error };
}
