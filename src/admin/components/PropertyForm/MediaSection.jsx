import React, { useState, useEffect } from 'react';
import { uploadImage, getPropertyMedia, setCoverImage, deleteMedia, addVideoUrl, reorderMedia } from '../../../lib/media';

export default function MediaSection({ propertyId, coverImageUrl, onCoverChange }) {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const fetchMedia = async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const data = await getPropertyMedia(propertyId);
      setMediaList(data);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [propertyId]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !propertyId) return;

    setUploading(true);
    try {
      for (const file of files) {
        await uploadImage(propertyId, file);
      }
      await fetchMedia();
      onCoverChange();
    } catch (err) {
      alert(err.message || 'Error uploading images');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSetCover = async (mediaItem) => {
    try {
      await setCoverImage(propertyId, mediaItem.id, mediaItem.public_url);
      await fetchMedia();
      onCoverChange();
    } catch (err) {
      alert(err.message || 'Failed to set cover image');
    }
  };

  const handleDelete = async (mediaItem) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    try {
      await deleteMedia(mediaItem.id, mediaItem.storage_path, propertyId);
      await fetchMedia();
      onCoverChange();
    } catch (err) {
      alert(err.message || 'Failed to delete media');
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!videoUrl || !propertyId) return;

    try {
      await addVideoUrl(propertyId, videoUrl);
      setVideoUrl('');
      await fetchMedia();
    } catch (err) {
      alert(err.message || 'Failed to add video');
    }
  };

  if (!propertyId) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">image</span>
        <h4 className="font-bold text-slate-700 text-sm">Save Property First</h4>
        <p className="text-xs text-slate-500 mt-1">Please save the basic details of the property before uploading images and media.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Photos & Media Gallery</h3>
          <p className="text-xs text-slate-500">Upload high-resolution property photos, architectural renders, and video embeds.</p>
        </div>

        <label className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-colors">
          <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
          {uploading ? 'Uploading...' : 'Upload Photos'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Upload Dropzone */}
      <label className="border-2 border-dashed border-slate-300 hover:border-primary bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-8 text-center block cursor-pointer transition-all">
        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">add_photo_alternate</span>
        <div className="font-bold text-sm text-slate-700">Click or drag photos here to upload</div>
        <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WebP up to 10MB each</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {/* Media Grid */}
      {loading ? (
        <div className="p-8 text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs text-slate-500">Loading gallery...</span>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 italic">
          No photos uploaded yet for this property.
        </div>
      ) : (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Uploaded Photos ({mediaList.filter(m => m.media_type === 'image').length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaList.map((item) => {
              const isCover = item.is_cover || item.public_url === coverImageUrl;
              return (
                <div key={item.id} className="group relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-[4/3]">
                  {item.media_type === 'image' ? (
                    <img src={item.public_url} alt="Property" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center p-2 text-center">
                      <span className="material-symbols-outlined text-3xl mb-1 text-red-500">play_circle</span>
                      <span className="text-[10px] truncate max-w-full">{item.public_url}</span>
                    </div>
                  )}

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[12px]">star</span> Cover Photo
                    </div>
                  )}

                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {!isCover && item.media_type === 'image' && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(item)}
                        title="Set as Cover Photo"
                        className="p-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg backdrop-blur-sm transition-colors text-xs font-bold"
                      >
                        Set Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      title="Delete Image"
                      className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <hr className="border-slate-200" />

      {/* Add Video Embed */}
      <form onSubmit={handleAddVideo} className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Add YouTube / Video Walkthrough URL</h4>
        <div className="flex gap-2">
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            Add Video
          </button>
        </div>
      </form>
    </div>
  );
}
