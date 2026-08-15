import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProperties, publishProperty, unpublishProperty, deleteProperty, duplicateProperty, updateProperty, normalizePrice } from '../../lib/properties';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function AdminProperties() {
  useDocumentTitle('Properties');

  const toast = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Sorting
  const [search, setSearch] = useState('');
  const [publishFilter, setPublishFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('latest'); 
  const [viewMode, setViewMode] = useState(localStorage.getItem('propertiesViewMode') || 'card');
  
  // Action state
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState(new Set());
  
  // Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [propertyToPublish, setPropertyToPublish] = useState(null);
  
  const [unpublishModalOpen, setUnpublishModalOpen] = useState(false);
  const [propertyToUnpublish, setPropertyToUnpublish] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('propertiesViewMode', viewMode);
  }, [viewMode]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await getAllProperties({
        publishState: publishFilter,
        propertyType: typeFilter,
        search,
      });
      setProperties(data);
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [publishFilter, typeFilter, search]);

  const sortedProperties = useMemo(() => {
    return [...properties].sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.updated_at) - new Date(a.updated_at);
      if (sortBy === 'price_desc') return (b.price_value || 0) - (a.price_value || 0);
      if (sortBy === 'price_asc') return (a.price_value || 0) - (b.price_value || 0);
      if (sortBy === 'locality') return (a.location || '').localeCompare(b.location || '');
      return 0;
    });
  }, [properties, sortBy]);

  const handleDuplicate = async (property) => {
    setActionLoadingId(property.id);
    try {
      const duplicated = await duplicateProperty(property.id);
      toast.success(`Property duplicated as "${duplicated.title}"! Redirecting...`);
      navigate(`/admin/properties/${duplicated.id}/edit`);
    } catch (err) {
      toast.error(err.message || 'Failed to duplicate property');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleFeatured = async (property) => {
    const newFeaturedState = !property.featured;
    try {
      await updateProperty(property.id, { featured: newFeaturedState });
      toast.success(newFeaturedState ? 'Marked as Featured!' : 'Removed from Featured');
      setProperties(properties.map(p => p.id === property.id ? { ...p, featured: newFeaturedState } : p));
    } catch (err) {
      toast.error('Failed to update featured status');
    }
  };

  const executePublish = async () => {
    if (!propertyToPublish) return;
    setActionLoadingId(propertyToPublish.id);
    try {
      await publishProperty(propertyToPublish.id, propertyToPublish);
      toast.success('Property published to live website');
      await fetchProperties();
      setPublishModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update publish state');
    } finally {
      setActionLoadingId(null);
      setPropertyToPublish(null);
    }
  };

  const executeUnpublish = async () => {
    if (!propertyToUnpublish) return;
    setActionLoadingId(propertyToUnpublish.id);
    try {
      await unpublishProperty(propertyToUnpublish.id);
      toast.success('Property unpublished and moved to drafts');
      await fetchProperties();
      setUnpublishModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update publish state');
    } finally {
      setActionLoadingId(null);
      setPropertyToUnpublish(null);
    }
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProperty(propertyToDelete.id);
      toast.success('Property permanently deleted');
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
      await fetchProperties();
    } catch (err) {
      toast.error(err.message || 'Failed to delete property');
    } finally {
      setIsDeleting(false);
    }
  };


  const propertyTypes = ['All', 'Luxury Apartment', 'Modern Villa', 'Row House', 'Investment Plot'];

  const handleBulkAction = async (actionType) => {
    if (selectedPropertyIds.size === 0) return;
    
    // We'll reuse the existing actionLoadingId but set it to 'bulk'
    setActionLoadingId('bulk');
    try {
      const ids = Array.from(selectedPropertyIds);
      if (actionType === 'publish') {
        const propertiesToPublish = properties.filter(p => ids.includes(p.id));
        for (const p of propertiesToPublish) {
           await publishProperty(p.id, p);
        }
        toast.success(`Published ${ids.length} properties`);
      } else if (actionType === 'unpublish') {
        for (const id of ids) await unpublishProperty(id);
        toast.success(`Unpublished ${ids.length} properties`);
      } else if (actionType === 'delete') {
        for (const id of ids) await deleteProperty(id);
        toast.success(`Deleted ${ids.length} properties`);
      }
      setSelectedPropertyIds(new Set());
      await fetchProperties();
    } catch (err) {
      toast.error(err.message || `Failed to perform bulk ${actionType}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedPropertyIds.size > 0) {
        setSelectedPropertyIds(new Set());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPropertyIds]);

  return (
    <div className="p-8 max-w-7xl mx-auto font-body-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-md font-bold text-3xl text-primary mb-1">Properties</h1>
          <p className="text-on-surface-variant text-sm">Manage listings, real estate media, and publication status.</p>
        </div>
        <Link
          to="/admin/properties/new"
          className="inline-flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#D8B56F] hover:scale-95 text-black px-6 py-2.5 rounded-lg font-extrabold text-sm transition-all duration-150 shadow-sm cursor-pointer border-none self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[20px] font-bold text-black">add</span>
          <span className="text-black font-extrabold">Add Property</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-t-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search property or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:bg-white transition-colors"
            />
          </div>
          
          {/* Status Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 overflow-x-auto">
            {['All', 'published', 'draft'].map((st) => (
              <button
                key={st}
                onClick={() => setPublishFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all whitespace-nowrap ${
                  publishFilter === st ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Type Filter */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px] pointer-events-none">apartment</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold pl-9 pr-8 py-2.5 text-slate-700 outline-none focus:border-primary appearance-none hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Types' : type}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px] pointer-events-none">expand_more</span>
          </div>

          {/* Sort Control */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px] pointer-events-none">sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold pl-9 pr-8 py-2.5 text-slate-700 outline-none focus:border-primary appearance-none hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <option value="latest">Latest Updated</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="locality">Locality (A-Z)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px] pointer-events-none">expand_more</span>
          </div>

          {/* View Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-slate-500">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'card' ? 'bg-white text-primary shadow-sm' : 'hover:text-slate-900'}`}
              title="Card View"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-primary shadow-sm' : 'hover:text-slate-900'}`}
              title="Table View"
            >
              <span className="material-symbols-outlined text-[18px]">list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Property List Content */}
      <div className={`bg-white rounded-b-2xl shadow-sm border border-t-0 border-outline-variant/30 ${viewMode === 'card' ? 'p-6' : 'overflow-hidden'}`}>
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500 font-medium">Loading properties...</p>
          </div>
        ) : sortedProperties.length === 0 ? (
          <div className="p-16 text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <span className="material-symbols-outlined text-4xl text-slate-400">
                {search || publishFilter !== 'All' || typeFilter !== 'All' ? 'search_off' : 'real_estate_agent'}
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              {search || publishFilter !== 'All' || typeFilter !== 'All' ? 'No matches found' : 'No properties yet'}
            </h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              {search || publishFilter !== 'All' || typeFilter !== 'All' 
                ? 'Try adjusting your search terms or clearing some filters to see more results.' 
                : 'Get started by creating your first property listing. It only takes a few minutes.'}
            </p>
            {search || publishFilter !== 'All' || typeFilter !== 'All' ? (
              <button 
                onClick={() => { setSearch(''); setPublishFilter('All'); setTypeFilter('All'); }} 
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                Clear All Filters
              </button>
            ) : (
              <Link 
                to="/admin/properties/new" 
                className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#D8B56F] hover:scale-95 text-black rounded-lg font-extrabold text-sm transition-all duration-150 shadow-sm cursor-pointer border-none inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px] font-bold text-black">add</span>
                <span className="text-black font-extrabold">Add Property</span>
              </Link>
            )}
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map(property => (
              <div key={property.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                <div className="h-48 bg-slate-100 relative">
                  {property.cover_image_url ? (
                    <img src={property.cover_image_url} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <span className="material-symbols-outlined text-[32px]">image</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <StatusBadge publishState={property.publish_state} />
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleFeatured(property)} 
                      title={property.featured ? 'Remove Featured Status' : 'Mark as Featured'}
                      className={`w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md shadow-sm transition-colors ${property.featured ? 'bg-amber-400 text-white' : 'bg-white/80 text-slate-400 hover:text-amber-500 hover:bg-white'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: property.featured ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                    </button>
                    <div 
                      className={`w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md shadow-sm transition-colors ${selectedPropertyIds.has(property.id) ? 'bg-primary text-white' : 'bg-white/80'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer w-4 h-4"
                        checked={selectedPropertyIds.has(property.id)}
                        onChange={(e) => {
                          const newSet = new Set(selectedPropertyIds);
                          if (e.target.checked) newSet.add(property.id);
                          else newSet.delete(property.id);
                          setSelectedPropertyIds(newSet);
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">{property.property_type || 'Property'}</div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1 leading-tight line-clamp-1">{property.title}</h3>
                    <p className="text-slate-500 text-xs flex items-center gap-1 mb-3">
                      <span className="material-symbols-outlined text-[14px]">location_on</span> {property.location || 'Location missing'}
                    </p>
                    <div className="font-bold text-xl text-slate-800 mb-4">{normalizePrice(property.starting_price) || 'Price TBD'}</div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600" title="Total Leads">
                      <div className="bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-[14px]">person</span>
                      </div>
                      {property.leads_count || 0}
                    </div>
                    
                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                      {property.publish_state === 'published' ? (
                        <button onClick={() => { setPropertyToUnpublish(property); setUnpublishModalOpen(true); }} disabled={actionLoadingId === property.id} title="Unpublish" className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-100 transition-colors flex items-center justify-center">
                          {actionLoadingId === property.id ? <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span> : <span className="material-symbols-outlined text-[16px]">public_off</span>}
                        </button>
                      ) : (
                        <button onClick={() => { setPropertyToPublish(property); setPublishModalOpen(true); }} disabled={actionLoadingId === property.id} title="Publish" className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors flex items-center justify-center">
                          {actionLoadingId === property.id ? <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span> : <span className="material-symbols-outlined text-[16px]">publish</span>}
                        </button>
                      )}
                      
                      <button onClick={() => handleDuplicate(property)} disabled={actionLoadingId === property.id} title="Duplicate Property" className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-100 transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      </button>
                      
                      <Link to={`/admin/properties/${property.id}/edit`} title="Edit" className="p-1.5 rounded-lg text-primary hover:bg-primary-container/20 transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </Link>
                      
                      <button onClick={() => { setPropertyToDelete(property); setDeleteModalOpen(true); }} title="Delete" className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs uppercase font-label-bold tracking-wider text-slate-500">
                  <th className="py-4 px-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer w-4 h-4"
                      checked={sortedProperties.length > 0 && selectedPropertyIds.size === sortedProperties.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedPropertyIds(new Set(sortedProperties.map(p => p.id)));
                        else setSelectedPropertyIds(new Set());
                      }}
                    />
                  </th>
                  <th className="py-4 px-2">Property</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedProperties.map((property) => (
                  <tr key={property.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedPropertyIds.has(property.id) ? 'bg-primary/5' : ''}`}>
                    <td className="py-4 px-4 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer w-4 h-4"
                        checked={selectedPropertyIds.has(property.id)}
                        onChange={(e) => {
                          const newSet = new Set(selectedPropertyIds);
                          if (e.target.checked) newSet.add(property.id);
                          else newSet.delete(property.id);
                          setSelectedPropertyIds(newSet);
                        }}
                      />
                    </td>
                    <td className="py-4 px-2 min-w-[280px]">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative group-hover:shadow-md transition-shadow">
                          {property.cover_image_url ? (
                            <img src={property.cover_image_url} alt={property.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><span className="material-symbols-outlined text-[24px]">image</span></div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-primary transition-colors flex items-center gap-2">
                            {property.title}
                            <button 
                              onClick={() => handleToggleFeatured(property)} 
                              title={property.featured ? 'Remove Featured Status' : 'Mark as Featured'}
                              className={`flex items-center justify-center transition-colors ${property.featured ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'}`}
                            >
                              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: property.featured ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                            </button>
                          </div>
                          <div className="text-xs text-slate-500 flex flex-col gap-0.5 mt-1">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {property.location || 'Location missing'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge publishState={property.publish_state} />
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800 text-base">{normalizePrice(property.starting_price) || 'Price TBD'}</div>
                      <span className="inline-block px-2 py-0.5 mt-1 bg-slate-100 text-slate-600 rounded text-[10px] font-medium uppercase tracking-wider">
                        {property.property_type || 'Property'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1 relative">
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          {/* Primary Action: Publish / Unpublish */}
                          {property.publish_state === 'published' ? (
                            <button onClick={() => { setPropertyToUnpublish(property); setUnpublishModalOpen(true); }} disabled={actionLoadingId === property.id} title="Unpublish / Move to Draft" className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-100 transition-colors flex items-center justify-center">
                              {actionLoadingId === property.id ? <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span> : <span className="material-symbols-outlined text-[18px]">public_off</span>}
                            </button>
                          ) : (
                            <button onClick={() => { setPropertyToPublish(property); setPublishModalOpen(true); }} disabled={actionLoadingId === property.id} title="Publish to Live Website" className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors flex items-center justify-center">
                              {actionLoadingId === property.id ? <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span> : <span className="material-symbols-outlined text-[18px]">publish</span>}
                            </button>
                          )}

                          {/* Duplicate Action */}
                          <button onClick={() => handleDuplicate(property)} disabled={actionLoadingId === property.id} title="Duplicate Property" className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-100 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                          </button>

                          {/* Edit Action */}
                          <Link to={`/admin/properties/${property.id}/edit`} title="Edit Property" className="p-1.5 rounded-lg text-primary hover:bg-primary-container/20 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </Link>
                          
                          {/* Delete Action */}
                          <button onClick={() => { setPropertyToDelete(property); setDeleteModalOpen(true); }} title="Delete Property" className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedPropertyIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-slate-900/20 flex items-center gap-6 border border-slate-800">
            <div className="font-bold flex items-center gap-2">
              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs">{selectedPropertyIds.size}</span>
              Selected
            </div>
            <div className="w-px h-6 bg-slate-700"></div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleBulkAction('publish')}
                disabled={actionLoadingId === 'bulk'}
                className="text-sm font-bold hover:text-emerald-400 transition-colors disabled:opacity-50 border-none bg-transparent cursor-pointer"
              >
                Publish All
              </button>
              <button 
                onClick={() => handleBulkAction('unpublish')}
                disabled={actionLoadingId === 'bulk'}
                className="text-sm font-bold hover:text-amber-400 transition-colors disabled:opacity-50 border-none bg-transparent cursor-pointer"
              >
                Unpublish All
              </button>
              <button 
                onClick={() => {
                  if(window.confirm(`Are you sure you want to permanently delete ${selectedPropertyIds.size} properties?`)) {
                    handleBulkAction('delete');
                  }
                }}
                disabled={actionLoadingId === 'bulk'}
                className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 border-none bg-transparent cursor-pointer"
              >
                Delete All
              </button>
            </div>
            <button 
              onClick={() => setSelectedPropertyIds(new Set())}
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Publish Confirmation Dialog */}
      <ConfirmDialog
        isOpen={publishModalOpen}
        title="Publish Property"
        message={`Are you sure you want to publish "${propertyToPublish?.title}"? This property will go live on the public website immediately.`}
        confirmText="Publish to Live Website"
        theme="primary"
        icon="rocket_launch"
        isLoading={actionLoadingId === propertyToPublish?.id}
        onConfirm={executePublish}
        onClose={() => setPublishModalOpen(false)}
      />

      {/* Unpublish Confirmation Dialog */}
      <ConfirmDialog
        isOpen={unpublishModalOpen}
        title="Unpublish Property"
        message={`Are you sure you want to unpublish "${propertyToUnpublish?.title}"? It will be removed from the public website and moved to drafts.`}
        confirmText="Unpublish Property"
        theme="amber"
        icon="visibility_off"
        isLoading={actionLoadingId === propertyToUnpublish?.id}
        onConfirm={executeUnpublish}
        onClose={() => setUnpublishModalOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Delete Property"
        message={`Are you sure you want to delete "${propertyToDelete?.title}"? This action cannot be undone and will permanently delete all associated media.`}
        confirmText="Delete Permanently"
        theme="red"
        icon="warning"
        requireTypeToConfirm="DELETE"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
