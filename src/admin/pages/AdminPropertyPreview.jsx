import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById, publishProperty, normalizeProperty, validateForPublish } from '../../lib/properties';
import PropertyDetail from '../../pages/PropertyDetail';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function AdminPropertyPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useDocumentTitle(property ? `Preview: ${property.title}` : 'Preview Property');

  const SESSION_KEY = `qs_edit_snapshot_${id}`;

  const fetchProperty = async () => {
    setLoading(true);
    try {
      // Read the session snapshot written by the edit page — this is always current.
      // The edit page writes it on every change, on every save, and before navigating here.
      const snapshot = sessionStorage.getItem(SESSION_KEY);
      if (snapshot) {
        try {
          const parsed = JSON.parse(snapshot);
          if (parsed && (parsed.id === id || parsed.slug === id)) {
            setProperty(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Corrupt snapshot — fall through to DB fetch
        }
      }

      // No snapshot (e.g. navigated directly to preview URL) — load from DB
      const data = await getPropertyById(id);
      setProperty(data);
    } catch (err) {
      alert('Failed to load property preview: ' + (err.message || 'Not found'));
      navigate('/admin/properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);


  const handlePublish = async () => {
    if (!property) return;
    const validation = validateForPublish(property);
    if (!validation.valid) {
      alert(`Cannot publish yet. Please complete: ${validation.missing.join(', ')}`);
      return;
    }

    setPublishing(true);
    try {
      await publishProperty(id, property);
      setToastMessage('Property successfully published!');
      setProperty(prev => ({ ...prev, publish_state: 'published' }));
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  if (loading || !property) {
    return (
      <div className="p-16 text-center min-h-[60vh] flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-sm text-slate-300 font-medium tracking-wide">Generating Live Property Preview...</span>
      </div>
    );
  }

  const normalized = normalizeProperty(property);
  const validation = validateForPublish(property);

  return (
    <div className="min-h-screen bg-surface">
      {/* Admin Top Sticky Bar */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md text-white px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Link 
            to="/admin/properties" 
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Properties
          </Link>
          <span className="text-slate-600">/</span>
          <Link 
            to={`/admin/properties/${id}/edit`} 
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Edit Listing
          </Link>
          <span className="text-slate-600">/</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white max-w-[200px] truncate">{property.title}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              property.publish_state === 'published' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {property.publish_state || 'Draft'} Preview
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {toastMessage && (
            <span className="text-xs text-emerald-400 font-bold animate-in fade-in flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {toastMessage}
            </span>
          )}

          <Link
            to={`/admin/properties/${id}/edit`}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-slate-700 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Edit Details
          </Link>

          {property.publish_state !== 'published' ? (
            <button
              onClick={handlePublish}
              disabled={publishing || !validation.valid}
              className={`px-5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-md ${
                validation.valid 
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer' 
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
              title={!validation.valid ? `Missing: ${validation.missing.join(', ')}` : 'Publish to live website'}
            >
              <span className="material-symbols-outlined text-[16px]">publish</span>
              {publishing ? 'Publishing...' : 'Publish to Live'}
            </button>
          ) : (
            <a
              href={`${import.meta.env.BASE_URL || '/questspaces/'}property/${property.slug || id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              View on Live Site
            </a>
          )}
        </div>
      </div>

      {/* Actual Pixel-Perfect Property Page Preview */}
      <PropertyDetail 
        customProperty={normalized}
        isPreview={true}
        savedIds={[]}
        onToggleSave={() => {}}
        onOpenVIPModal={(title) => alert(`[Preview Mode]: VIP Inquiry modal triggered for "${title}". Leads are disabled in preview.`)}
      />
    </div>
  );
}
