import supabase from './supabase.js';

// ─────────────────────────────────────────────────────
// Upload an image file to Supabase Storage
// ─────────────────────────────────────────────────────
export async function uploadImage(propertyId, file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
  const storagePath = `${propertyId}/images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('property-media')
    .upload(storagePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('property-media')
    .getPublicUrl(storagePath);

  const publicUrl = urlData.publicUrl;

  // Get current max display_order
  const { data: existing } = await supabase
    .from('property_media')
    .select('display_order')
    .eq('property_id', propertyId)
    .order('display_order', { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

  const { data: mediaRecord, error: dbError } = await supabase
    .from('property_media')
    .insert([{
      property_id: propertyId,
      media_type: 'image',
      storage_path: storagePath,
      public_url: publicUrl,
      display_order: nextOrder,
      is_cover: nextOrder === 0, // First image is auto-cover (can be changed)
    }])
    .select()
    .single();

  if (dbError) throw dbError;

  // If this is the first image, also set as cover_image_url on the property
  if (nextOrder === 0) {
    await supabase
      .from('properties')
      .update({ cover_image_url: publicUrl })
      .eq('id', propertyId);
  }

  return mediaRecord;
}

// ─────────────────────────────────────────────────────
// Add a video (URL-based: YouTube / Vimeo)
// ─────────────────────────────────────────────────────
export async function addVideoUrl(propertyId, videoUrl, thumbnailUrl = null) {
  const { data, error } = await supabase
    .from('property_media')
    .insert([{
      property_id: propertyId,
      media_type: 'video',
      storage_path: null,
      public_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      is_cover: false,
      display_order: 9999,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─────────────────────────────────────────────────────
// Get all media for a property (ordered)
// ─────────────────────────────────────────────────────
export async function getPropertyMedia(propertyId) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('property_media')
        .select('*')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: true });

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getPropertyMedia failed:', err);
    }
  }
  return [];
}

// ─────────────────────────────────────────────────────
// Set an image as the cover
// ─────────────────────────────────────────────────────
export async function setCoverImage(propertyId, mediaId, publicUrl) {
  // Clear existing cover flag on all media for this property
  await supabase
    .from('property_media')
    .update({ is_cover: false })
    .eq('property_id', propertyId);

  // Set new cover
  await supabase
    .from('property_media')
    .update({ is_cover: true })
    .eq('id', mediaId);

  // Update denormalized cover_image_url on the property
  await supabase
    .from('properties')
    .update({ cover_image_url: publicUrl })
    .eq('id', propertyId);
}

// ─────────────────────────────────────────────────────
// Reorder media — pass array of {id, display_order}
// ─────────────────────────────────────────────────────
export async function reorderMedia(updates) {
  const promises = updates.map(({ id, display_order }) =>
    supabase.from('property_media').update({ display_order }).eq('id', id)
  );
  await Promise.all(promises);
}

// ─────────────────────────────────────────────────────
// Delete a media record (and from storage if applicable)
// ─────────────────────────────────────────────────────
export async function deleteMedia(mediaId, storagePath, propertyId) {
  // Remove from DB
  const { data: deleted, error: dbError } = await supabase
    .from('property_media')
    .delete()
    .eq('id', mediaId)
    .select()
    .single();

  if (dbError) throw dbError;

  // Remove from storage if it was a direct upload
  if (storagePath) {
    await supabase.storage.from('property-media').remove([storagePath]);
  }

  // If deleted image was the cover, promote the next image
  if (deleted.is_cover) {
    const { data: remaining } = await supabase
      .from('property_media')
      .select('id, public_url')
      .eq('property_id', propertyId)
      .eq('media_type', 'image')
      .order('display_order', { ascending: true })
      .limit(1);

    if (remaining && remaining.length > 0) {
      await setCoverImage(propertyId, remaining[0].id, remaining[0].public_url);
    } else {
      // No images left — clear cover
      await supabase.from('properties').update({ cover_image_url: null }).eq('id', propertyId);
    }
  }
}
