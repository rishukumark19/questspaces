import React, { useState, useEffect, useRef } from 'react';
import { uploadImage, getPropertyMedia, setCoverImage, deleteMedia, addVideoUrl, reorderMedia } from '../../../lib/media';
import { parseVideoUrl } from '../../../utils/video';
import { useToast } from '../../hooks/useToast';
import ConfirmDialog from '../ConfirmDialog';

export default function MediaSection({ propertyId, coverImageUrl, onCoverChange, formData, onFieldChange }) {
  const toast = useToast();
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  
  // Drag and drop & preview states
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMedia = async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const data = await getPropertyMedia(propertyId);
      setMediaList(data);
    } catch (err) {
      console.warn('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [propertyId]);

  const generatePreviews = (files) => {
    const newPreviews = [];
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push({ url: e.target.result, name: file.name, isUploading: true });
          setPreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || (e.dataTransfer && e.dataTransfer.files) || []);
    if (!files.length || !propertyId) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });
    generatePreviews(files);

    try {
      let completed = 0;
      for (const file of files) {
        await uploadImage(propertyId, file);
        completed++;
        setUploadProgress(prev => ({ ...prev, current: completed }));
      }
      
      await fetchMedia();
      onCoverChange?.();
      toast.success('Images uploaded successfully');
    } catch (err) {
      toast.error(err.message || 'Error uploading images');
    } finally {
      setUploading(false);
      setPreviews([]);
      setUploadProgress({ current: 0, total: 0 });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!uploading) {
      handleFileUpload(e);
    }
  };

  const handleSetCover = async (mediaItem) => {
    try {
      await setCoverImage(propertyId, mediaItem.id, mediaItem.public_url);
      await fetchMedia();
      onCoverChange?.();
      toast.success('Cover image updated');
    } catch (err) {
      toast.error(err.message || 'Failed to set cover image');
    }
  };

  const confirmDelete = (mediaItem) => {
    setMediaToDelete(mediaItem);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!mediaToDelete) return;
    setIsDeleting(true);
    try {
      await deleteMedia(mediaToDelete.id, mediaToDelete.storage_path, propertyId);
      toast.success('Media deleted successfully');
      await fetchMedia();
      onCoverChange?.();
      setDeleteModalOpen(false);
      setMediaToDelete(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete media');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = async (index, direction) => {
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === mediaList.length - 1)
    ) return;

    const newIndex = index + direction;
    const newMediaList = [...mediaList];
    
    // Swap items
    const temp = newMediaList[index];
    newMediaList[index] = newMediaList[newIndex];
    newMediaList[newIndex] = temp;
    
    // Update display_order sequentially
    const updates = newMediaList.map((m, i) => ({
      id: m.id,
      display_order: i
    }));

    // Optimistic UI update
    setMediaList(newMediaList);
    
    try {
      await reorderMedia(updates);
    } catch (err) {
      toast.error(err.message || 'Failed to reorder media');
      fetchMedia(); // Revert on failure
    }
  };

  // Video Handlers
  const handleAddVideo = async (e) => {
    if (e) e.preventDefault();
    if (!videoUrl) return;

    const parsed = parseVideoUrl(videoUrl);
    if (!parsed) {
      toast.error('Please enter a valid YouTube, Vimeo, or direct video URL');
      return;
    }

    // 1. Immediately save to formData so it's persisted and visible in preview
    onFieldChange?.('walkthrough_video_url', videoUrl.trim());

    // 2. Also try saving to DB media table if supported
    if (propertyId) {
      try {
        await addVideoUrl(propertyId, videoUrl.trim());
        await fetchMedia();
      } catch (err) {
        console.warn('DB video link failed, saved to property data:', err);
      }
    }

    toast.success('Video walkthrough linked to property');
    setVideoUrl('');
  };

  const handleRemoveVideo = () => {
    onFieldChange?.('walkthrough_video_url', '');
    toast.success('Video walkthrough removed');
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

  const currentVideo = formData?.walkthrough_video_url || (mediaList.find(m => m.media_type === 'video')?.public_url) || '';
  const parsedCurrentVideo = parseVideoUrl(currentVideo);
  const downloadVideoParsed = parseVideoUrl(formData?.walkthrough_video_url);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Photos & Media Gallery</h3>
          <p className="text-xs text-slate-500 mt-1">Upload high-resolution property photos, architectural renders, and video tour embeds.</p>
        </div>

        <label className={`bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
          Select Photos
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            ref={fileInputRef}
            className="hidden"
          />
        </label>
      </div>

      {/* Upload Dropzone */}
      <label 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center block transition-all ${
          isDragging ? 'border-primary bg-primary/5' : 'border-slate-300 bg-slate-50 hover:border-primary hover:bg-slate-50/80'
        } ${uploading ? 'pointer-events-none opacity-80' : 'cursor-pointer'}`}
      >
        {!uploading ? (
          <>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${isDragging ? 'bg-primary/20 text-primary' : 'bg-white text-slate-400 border border-slate-200 shadow-sm'}`}>
              <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
            </div>
            <div className="font-bold text-base text-slate-700">Click or drag photos here to upload</div>
            <p className="text-xs text-slate-400 mt-2">Supports JPG, PNG, WebP up to 10MB each</p>
          </>
        ) : (
          <div className="py-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <div className="font-bold text-slate-700">Uploading {uploadProgress.current} of {uploadProgress.total} photos...</div>
            
            {/* Progress Bar */}
            <div className="w-64 h-2 bg-slate-200 rounded-full mx-auto mt-4 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
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
      {loading && mediaList.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs text-slate-500">Loading gallery...</span>
        </div>
      ) : (mediaList.length > 0 || previews.length > 0) && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Uploaded Photos ({mediaList.filter(m => m.media_type === 'image').length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            
            {/* Real Uploaded Media */}
            {mediaList.map((item, index) => {
              const isCover = item.is_cover || item.public_url === coverImageUrl;
              const isVideo = item.media_type === 'video';
              const vidParsed = isVideo ? parseVideoUrl(item.public_url) : null;

              return (
                <div key={item.id || index} className="group relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] shadow-sm">
                  {!isVideo ? (
                    <img src={item.public_url} alt="Property" className="w-full h-full object-cover" />
                  ) : (
                    <div 
                      className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center p-2 text-center relative cursor-pointer group/vid"
                      onClick={() => setActiveVideoModal(vidParsed || { embedUrl: item.public_url, type: 'custom' })}
                    >
                      {vidParsed?.thumbnailUrl && (
                        <img src={vidParsed.thumbnailUrl} alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/vid:opacity-80 transition-opacity" />
                      )}
                      <div className="relative z-10 flex flex-col items-center">
                        <span className="material-symbols-outlined text-4xl text-amber-400 mb-1 group-hover/vid:scale-110 transition-transform">play_circle</span>
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded-full">Test Video</span>
                      </div>
                    </div>
                  )}

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm z-20">
                      <span className="material-symbols-outlined text-[12px]">star</span> Cover Photo
                    </div>
                  )}

                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                    
                    {/* Top Row: Reorder & Delete */}
                    <div className="flex justify-between w-full">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleMove(index, -1)}
                          disabled={index === 0}
                          className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg disabled:opacity-30 disabled:hover:bg-white/20 disabled:hover:text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(index, 1)}
                          disabled={index === mediaList.length - 1}
                          className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg disabled:opacity-30 disabled:hover:bg-white/20 disabled:hover:text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => confirmDelete(item)}
                        title="Delete Media"
                        className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    {/* Bottom Row: Set Cover */}
                    {!isCover && !isVideo && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(item)}
                        title="Set as Cover Photo"
                        className="w-full py-2 bg-white hover:bg-primary hover:border-primary text-slate-900 hover:text-white rounded-lg transition-colors text-xs font-bold mt-auto shadow-sm border border-transparent"
                      >
                        Set as Cover
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Client-Side Previews (Uploading state) */}
            {previews.map((preview, index) => (
              <div key={`preview-${index}`} className="relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] shadow-sm before:absolute before:inset-0 before:bg-white/50 before:z-10">
                <img src={preview.url} alt={preview.name} className="w-full h-full object-cover blur-[2px]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {mediaList.length === 0 && previews.length === 0 && !loading && (
         <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
           No photos uploaded yet for this property.
         </div>
      )}

      {/* ── Virtual Video Walkthrough Section ──────────────────────────────── */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
              <span className="material-symbols-outlined text-2xl">videocam</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Video Walkthrough & Virtual Tour</h4>
              <p className="text-xs text-slate-400 mt-0.5">Embed a YouTube, Vimeo, or direct video URL to showcase a walkthrough tour.</p>
            </div>
          </div>

          {parsedCurrentVideo && (
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold self-start sm:self-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Video Active
            </span>
          )}
        </div>

        {/* Video Embed Player Preview */}
        {parsedCurrentVideo ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <span className="uppercase tracking-wider text-amber-400 font-bold">{parsedCurrentVideo.type} Tour</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 truncate max-w-sm sm:max-w-md">{parsedCurrentVideo.originalUrl}</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="text-xs text-red-400 hover:text-red-300 font-bold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Remove Video
              </button>
            </div>

            {/* Embedded Responsive Player */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
              {parsedCurrentVideo.type === 'youtube' || parsedCurrentVideo.type === 'vimeo' || parsedCurrentVideo.type === 'custom' ? (
                <iframe
                  src={parsedCurrentVideo.embedUrl}
                  title="Video Walkthrough Preview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={parsedCurrentVideo.embedUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        ) : (
          /* Video Input Form */
          <form onSubmit={handleAddVideo} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 placeholder:text-slate-500 shadow-inner"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_link</span>
                Embed Video
              </button>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-amber-400">info</span>
              Supports YouTube (watch URLs, shortlinks, shorts), Vimeo, Google Drive preview links, and MP4 files.
            </p>
          </form>
        )}
      </div>

      {/* ── Downloads Hub ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">download</span>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Downloads & Direct Links</h4>
            <p className="text-xs text-slate-500">
              Configure downloadable documents. Leave blank to hide a download card on the property page.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Brochure */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-red-500 text-xl">picture_as_pdf</span>
              <span className="font-bold text-slate-800 text-sm">Project Brochure PDF</span>
            </div>
            <input
              type="url"
              value={formData?.brochure_url || ''}
              onChange={(e) => onFieldChange?.('brochure_url', e.target.value)}
              placeholder="PDF URL or Google Drive link"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <p className="text-[10px] text-slate-400">Google Drive: share as "Anyone with link can view"</p>
          </div>

          {/* Master Plan */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-emerald-500 text-xl">map</span>
              <span className="font-bold text-slate-800 text-sm">Master Plan Image</span>
            </div>
            <div className="space-y-2">
              <input
                type="url"
                value={formData?.master_plan_image_url || ''}
                onChange={(e) => onFieldChange?.('master_plan_image_url', e.target.value)}
                placeholder="Master plan image URL"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary"
              />
              {formData?.master_plan_image_url && (
                <div className="h-20 rounded-lg overflow-hidden border border-slate-200">
                  <img src={formData.master_plan_image_url} alt="Master plan preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>
          </div>

          {/* Walkthrough Video URL Direct Field */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-purple-500 text-xl">videocam</span>
              <span className="font-bold text-slate-800 text-sm">Walkthrough Video URL</span>
            </div>
            <input
              type="url"
              value={formData?.walkthrough_video_url || ''}
              onChange={(e) => onFieldChange?.('walkthrough_video_url', e.target.value)}
              placeholder="YouTube or Vimeo URL"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary"
            />
            {downloadVideoParsed && (
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                Valid {downloadVideoParsed.type} link
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Video Lightbox Test Modal */}
      {activeVideoModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveVideoModal(null)}
        >
          <button
            onClick={() => setActiveVideoModal(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 p-2.5 rounded-full cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <div 
            className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {activeVideoModal.type === 'youtube' || activeVideoModal.type === 'vimeo' || activeVideoModal.type === 'custom' ? (
              <iframe
                src={activeVideoModal.embedUrl}
                title="Video Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                src={activeVideoModal.embedUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Delete Media"
        message="Are you sure you want to delete this media item? It cannot be undone."
        confirmText="Delete Permanently"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
