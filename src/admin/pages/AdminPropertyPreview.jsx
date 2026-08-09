import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById, publishProperty } from '../../lib/properties';

export default function AdminPropertyPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const [activeImage, setActiveImage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const data = await getPropertyById(id);
      setProperty(data);
      if (data.property_media && data.property_media.length > 0) {
        setActiveImage(data.property_media[0].public_url);
      } else if (data.cover_image_url) {
        setActiveImage(data.cover_image_url);
      }
    } catch (err) {
      alert('Failed to load property');
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
    setPublishing(true);
    try {
      await publishProperty(id, property);
      alert('Property published successfully!');
      navigate('/admin/properties');
    } catch (err) {
      alert(err.message || 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-sm text-slate-500 font-medium">Loading property preview...</span>
      </div>
    );
  }

  const images = (property.property_media && property.property_media.length > 0)
    ? property.property_media.map(m => m.public_url)
    : [property.cover_image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

  const badges = property.badges || [];
  const highlights = property.highlights || [];
  const amenities = property.amenities || [];
  const proximity = property.proximity || [];

  return (
    <div>
      {/* Admin Top Sticky Bar */}
      <div className="sticky top-0 z-50 bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Link to={`/admin/properties/${id}/edit`} className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Editor
          </Link>
          <div className="h-4 w-px bg-slate-700"></div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">visibility</span> Preview Mode ({property.publish_state})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/admin/properties/${id}/edit`}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-colors"
          >
            Edit Property
          </Link>
          {property.publish_state !== 'published' && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-5 py-1.5 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">publish</span>
              {publishing ? 'Publishing...' : 'Publish Now'}
            </button>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="bg-surface text-on-surface font-body-md antialiased p-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">{property.title}</h1>
          <p className="text-slate-500 text-sm">{property.location} • {property.property_type}</p>
        </div>

        {/* Hero Image */}
        <div className="h-96 rounded-2xl overflow-hidden mb-6 bg-slate-100">
          <img src={activeImage || images[0]} alt={property.title} className="w-full h-full object-cover" />
        </div>

        {/* Image Strip */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                activeImage === img ? 'border-primary scale-105' : 'border-transparent opacity-70'
              }`}
            >
              <img src={img} alt="Thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Quick Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200 mb-8">
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Starting Price</div>
            <div className="text-lg font-bold text-slate-900">{property.starting_price || 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Configurations</div>
            <div className="text-lg font-bold text-slate-900">{(property.bhk_options || []).join(' & ') || 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Land Parcel</div>
            <div className="text-lg font-bold text-slate-900">{property.land_parcel || 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Total Units</div>
            <div className="text-lg font-bold text-slate-900">{property.total_units || 'N/A'}</div>
          </div>
        </div>

        {/* Description */}
        <div className="prose max-w-none text-slate-700 space-y-4 mb-8">
          <h3 className="text-lg font-bold text-slate-900">Overview</h3>
          <p>{property.description}</p>
          <p>{property.long_description}</p>
        </div>

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Key Highlights</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
