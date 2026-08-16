/**
 * Video helper utilities for YouTube, Vimeo, and direct video links
 */

export function parseVideoUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // 1. YouTube: Standard, shortlink, embed, or shorts
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      id: videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      originalUrl: trimmed
    };
  }

  // 2. Vimeo: standard or player URL
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      id: videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
      thumbnailUrl: null,
      originalUrl: trimmed
    };
  }

  // 3. Direct HTML5 Video File (mp4, webm, ogg, mov)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return {
      type: 'direct',
      id: trimmed,
      embedUrl: trimmed,
      thumbnailUrl: null,
      originalUrl: trimmed
    };
  }

  // 4. Fallback URL (Google Drive preview or other iframes)
  if (/^https?:\/\//i.test(trimmed)) {
    let embedUrl = trimmed;
    // Google Drive video preview URL conversion
    if (trimmed.includes('drive.google.com/file/d/')) {
      embedUrl = trimmed.replace(/\/view(\?.*)?$/, '/preview');
    }
    return {
      type: 'custom',
      id: trimmed,
      embedUrl: embedUrl,
      thumbnailUrl: null,
      originalUrl: trimmed
    };
  }

  return null;
}
