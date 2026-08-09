import { useState, useEffect } from 'react';
import { getPublishedProperty } from '../lib/properties';
import { PROPERTIES as STATIC_PROPERTIES } from '../data/properties';

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
            startingPrice: data.starting_price,
            priceValue: data.price_value,
            pricePerSqFt: data.price_per_sqft,
            bhkOptions: data.bhk_options || [],
            landParcel: data.land_parcel,
            totalUnits: data.total_units,
            towerHeight: data.tower_height,
            reraId: data.rera_id,
            micromarketLabel: data.micromarket_label,
            propertyType: data.property_type,
            longDescription: data.long_description,
            pricingMatrix: data.pricing_matrix || [],
            amenities: data.amenities || [],
            proximity: data.proximity || [],
            badges: data.badges || [],
            highlights: data.highlights || []
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
