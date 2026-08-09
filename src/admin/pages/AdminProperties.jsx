import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProperties, publishProperty, unpublishProperty, deleteProperty, duplicateProperty } from '../../lib/properties';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [publishFilter, setPublishFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

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

  const handleDuplicate = async (property) => {
    setActionLoadingId(property.id);
    try {
      const duplicated = await duplicateProperty(property.id);
      alert(`Property duplicated as "${duplicated.title}"! Redirecting to editor...`);
      navigate(`/admin/properties/${duplicated.id}/edit`);
    } catch (err) {
      alert(err.message || 'Failed to duplicate property');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTogglePublish = async (property) => {
    setActionLoadingId(property.id);
    try {
      if (property.publish_state === 'published') {
        await unpublishProperty(property.id);
      } else {
        await publishProperty(property.id, property);
      }
      await fetchProperties();
    } catch (err) {
      alert(err.message || 'Failed to update publish state');
    } finally {
      setActionLoadingId(null);
    }
  };

  const confirmDelete = (property) => {
    setPropertyToDelete(property);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProperty(propertyToDelete.id);
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
      await fetchProperties();
    } catch (err) {
      alert(err.message || 'Failed to delete property');
    } finally {
      setIsDeleting(false);
    }
  };

  const propertyTypes = ['All', 'Luxury Apartment', 'Modern Villa', 'Row House', 'Investment Plot'];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-md font-bold text-3xl text-primary mb-1">Properties</h1>
          <p className="text-on-surface-variant text-sm">Manage all real estate listings, status, and media.</p>
        </div>
        <Link
          to="/admin/properties/new"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-full font-label-bold transition-colors shadow-sm self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Property
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/30 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            {['All', 'published', 'draft', 'archived'].map((st) => (
              <button
                key={st}
                onClick={() => setPublishFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  publishFilter === st ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold px-3 py-2 text-slate-700 outline-none focus:border-primary"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'All' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500 font-medium">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">real_estate_agent</span>
            <h3 className="font-bold text-slate-700 text-lg mb-1">No properties found</h3>
            <p className="text-slate-500 text-sm mb-4">Try tweaking your search or filters.</p>
            <button
              onClick={() => { setSearch(''); setPublishFilter('All'); setTypeFilter('All'); }}
              className="text-xs text-primary font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs uppercase font-label-bold tracking-wider text-slate-500">
                  <th className="py-4 px-6">Property</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Starting Price</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Last Updated</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          {property.cover_image_url ? (
                            <img
                              src={property.cover_image_url}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <span className="material-symbols-outlined text-[24px]">image</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-primary transition-colors flex items-center gap-2">
                            {property.title}
                            {property.featured && (
                              <span className="material-symbols-outlined text-[16px] text-amber-500" title="Featured Property">star</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            {property.location || 'Location not set'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                        {property.property_type || 'Apartment'}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {property.starting_price || 'N/A'}
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge publishState={property.publish_state} />
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-500">
                      {property.updated_at ? new Date(property.updated_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : 'N/A'}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Publish */}
                        <button
                          onClick={() => handleTogglePublish(property)}
                          disabled={actionLoadingId === property.id}
                          title={property.publish_state === 'published' ? 'Unpublish' : 'Publish'}
                          className={`p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
                            actionLoadingId === property.id ? 'opacity-50' : ''
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {property.publish_state === 'published' ? 'unpublished' : 'publish'}
                          </span>
                        </button>

                        {/* Preview */}
                        <Link
                          to={`/admin/properties/${property.id}/preview`}
                          title="Preview Property"
                          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </Link>

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(property)}
                          disabled={actionLoadingId === property.id}
                          title="Duplicate Property"
                          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">content_copy</span>
                        </button>

                        {/* Edit */}
                        <Link
                          to={`/admin/properties/${property.id}/edit`}
                          title="Edit Property"
                          className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => confirmDelete(property)}
                          title="Delete Property"
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Delete Property"
        message={`Are you sure you want to delete "${propertyToDelete?.title}"? This action cannot be undone and will permanently delete all associated media.`}
        confirmText="Delete Property"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
