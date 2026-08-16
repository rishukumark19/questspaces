import { useState, useEffect } from 'react';
import { getPublishedProperty, normalizeProperty } from '../lib/properties';
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
          setProperty(normalizeProperty(data));
        } else {
          const found = STATIC_PROPERTIES.find(p => p.slug === slugOrId || p.id === slugOrId);
          setProperty(normalizeProperty(found || STATIC_PROPERTIES[0]));
        }
      })
      .catch((err) => {
        console.error('Supabase query failed, falling back to static item:', err);
        if (isMounted) {
          setError(err);
          const found = STATIC_PROPERTIES.find(p => p.slug === slugOrId || p.id === slugOrId);
          setProperty(normalizeProperty(found || STATIC_PROPERTIES[0]));
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [slugOrId]);

  return { property, loading, error };
}
