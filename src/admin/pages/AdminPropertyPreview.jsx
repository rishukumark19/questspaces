import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById, publishProperty } from '../../lib/properties';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function AdminPropertyPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const [activeImage, setActiveImage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useDocumentTitle('Preview Property');

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
  const pricing_matrix = property.pricing_matrix || [];
  const recent_updates = property.recent_updates || [];
  const specifications = property.specifications || [];
  const price_insights = property.price_insights || [];
  const buyer_personas = property.buyer_personas || [];

  return (
    <div>
      {/* Admin Top Sticky Bar */}
      <div className="sticky top-0 z-50 bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Link to="/admin/properties" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1">
            Properties
          </Link>
          <span className="material-symbols-outlined text-slate-600 text-[14px]">chevron_right</span>
          <Link to={`/admin/properties/${id}/edit`} className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1">
            Edit
          </Link>
          <span className="material-symbols-outlined text-slate-600 text-[14px]">chevron_right</span>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">visibility</span> Preview ({property.publish_state})
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
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-slate-500 text-sm">{property.location} • {property.property_type}</span>
            {badges.map((b, i) => (
              <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-full border border-amber-200">
                {b}
              </span>
            ))}
          </div>
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

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenityItem, i) => {
                if (typeof amenityItem === 'string') {
                  return (
                    <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">star</span>
                      {amenityItem}
                    </span>
                  );
                } else if (amenityItem.list) {
                  return (
                    <div key={i} className="w-full mb-2">
                      {amenityItem.category && <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">{amenityItem.category}</h4>}
                      <div className="flex flex-wrap gap-2">
                        {(amenityItem.list || []).map((amenity, j) => (
                          <span key={`${i}-${j}`} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-primary">star</span>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Pricing Matrix */}
        {pricing_matrix.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Pricing Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Configuration</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Size (Sq.Ft)</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pricing_matrix.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm font-semibold text-slate-800">{row.config}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {row.superArea || row.carpetArea ? `${(row.superArea || row.carpetArea).replace(/sq\.?\s*ft\.?/i, '').trim()} Sq.Ft.` : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900">
                        {row.price ? (row.price.startsWith('₹') ? row.price : `₹${row.price}`) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Developer Profile */}
        {(property.developer_description || property.developer_experience || property.developer_projects_count) && (
          <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-4 mb-4">
              {property.developer_logo_url && (
                <img src={property.developer_logo_url} alt="Developer Logo" className="w-16 h-16 object-contain bg-white rounded-lg border border-slate-200 p-1" />
              )}
              <div>
                <h3 className="text-lg font-bold text-slate-900">{property.developer}</h3>
                <div className="flex gap-4 text-sm text-slate-600 mt-1">
                  {property.developer_experience && <span><strong className="text-slate-900">{property.developer_experience}</strong> Experience</span>}
                  {property.developer_projects_count && <span><strong className="text-slate-900">{property.developer_projects_count}</strong> Projects</span>}
                </div>
              </div>
            </div>
            {property.developer_description && (
              <p className="text-sm text-slate-700 leading-relaxed">{property.developer_description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
