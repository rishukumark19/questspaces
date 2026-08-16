import React, { useState, useEffect } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useToast } from '../hooks/useToast';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  getAllTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} from '../../lib/testimonials';

export default function AdminTestimonials() {
  useDocumentTitle('Manage Testimonials');
  const toast = useToast();

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    quote: '',
    image: '',
    rating: 5,
    status: 'published',
    display_order: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getAllTestimonials({
        status: statusFilter,
        search
      });
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [statusFilter, search]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      title: '',
      quote: '',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      rating: 5,
      status: 'published',
      display_order: testimonials.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (testimonial) => {
    setEditingItem(testimonial);
    setFormData({
      name: testimonial.name || '',
      title: testimonial.title || '',
      quote: testimonial.quote || testimonial.text || '',
      image: testimonial.image || '',
      rating: testimonial.rating || 5,
      status: testimonial.status || 'published',
      display_order: testimonial.display_order || 1
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quote.trim()) {
      toast.error('Name and Review text are required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateTestimonial(editingItem.id, formData);
        toast.success('Testimonial updated successfully!');
      } else {
        await createTestimonial(formData);
        toast.success('Testimonial created successfully!');
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      console.error('Error saving testimonial:', err);
      toast.error(err.message || 'Failed to save testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTestimonial(itemToDelete.id);
      toast.success('Testimonial deleted successfully');
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchTestimonials();
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      toast.error('Failed to delete testimonial');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-body-md min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-headline-md font-bold text-3xl text-slate-900 mb-2">Testimonials</h1>
          <p className="text-slate-500 font-medium">Manage client testimonials shown on the website and landing pages.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenAdd}
            className="bg-primary text-gold px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:scale-95 transition-transform flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> Add Testimonial
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, role or review..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-primary"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft / Hidden</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 flex-1 flex flex-col overflow-hidden p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <span className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></span>
            <p className="font-semibold text-sm">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <span className="material-symbols-outlined text-5xl mb-3 text-slate-300">format_quote</span>
            <p className="font-bold text-slate-700">No testimonials found</p>
            <p className="text-sm text-slate-400 mt-1 mb-4">Get started by creating your first client review.</p>
            <button
              onClick={handleOpenAdd}
              className="bg-primary text-gold px-4 py-2 rounded-lg text-xs font-bold shadow hover:bg-primary/90 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add</span> Add Testimonial
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(testimonial => {
              const reviewText = testimonial.quote || testimonial.text || '';
              const isPub = testimonial.status === 'published';
              return (
                <div 
                  key={testimonial.id} 
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top row: stars + status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-amber-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        ))}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPub ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {testimonial.status || 'published'}
                      </span>
                    </div>

                    {/* Client info */}
                    <div className="flex items-center gap-3.5 mb-4">
                      {testimonial.image ? (
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                          {testimonial.name ? testimonial.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 text-base truncate">{testimonial.name}</h3>
                        <p className="text-slate-500 text-xs font-medium truncate">{testimonial.title}</p>
                      </div>
                    </div>

                    {/* Quote */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 italic border-l-2 border-gold/60 pl-3 line-clamp-4 bg-white/50 p-2.5 rounded-r-lg">
                      "{reviewText}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-200/80">
                    <button 
                      onClick={() => handleOpenEdit(testimonial)}
                      className="flex-1 bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-slate-500">edit</span> Edit
                    </button>
                    <button 
                      onClick={() => {
                        setItemToDelete(testimonial);
                        setDeleteModalOpen(true);
                      }}
                      className="flex-1 bg-white border border-red-200 text-red-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-50 hover:border-red-300 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  {editingItem ? 'edit_square' : 'add_circle'}
                </span>
                {editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Title / Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tech Executive & Investor"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Review / Quote <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write the client testimonial here..."
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white leading-relaxed resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Rating (Stars)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-primary focus:bg-white"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-primary focus:bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft / Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Avatar Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-gold px-6 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  {isSubmitting && <span className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></span>}
                  {editingItem ? 'Save Changes' : 'Create Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Delete Testimonial"
        message={`Are you sure you want to permanently delete the testimonial by "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Testimonial"
        theme="red"
        icon="delete"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
}
