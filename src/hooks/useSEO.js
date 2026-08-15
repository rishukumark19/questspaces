import { useEffect } from 'react';

export function useSEO({ title, description, image, url, type = 'website', jsonLd }) {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = title ? `${title} | Quest Spaces` : 'Quest Spaces | Premium Real Estate Advisory';
    document.title = fullTitle;

    // Helper to set meta tags
    const setMetaTag = (attr, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);

    // 3. Open Graph Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', url || window.location.href);
    if (image) {
      setMetaTag('property', 'og:image', image);
    }

    // 4. Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    if (image) {
      setMetaTag('name', 'twitter:image', image);
    }

    // 5. JSON-LD Structured Data
    if (jsonLd) {
      let script = document.getElementById('seo-jsonld');
      if (!script) {
        script = document.createElement('script');
        script.id = 'seo-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.innerText = JSON.stringify(jsonLd);
    } else {
      // Remove it if not provided on this page
      const script = document.getElementById('seo-jsonld');
      if (script) script.remove();
    }
  }, [title, description, image, url, type, jsonLd]);
}
