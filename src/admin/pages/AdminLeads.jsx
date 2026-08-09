import React, { useEffect, useState } from 'react';
import { getAllLeads, updateLeadStatus, deleteLead } from '../../lib/leads';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportCSV = () => {
    if (!leads.length) return;
    const headers = ['Client Name', 'Phone', 'Email', 'Property/Corridor', 'Lead Type', 'Status', 'Submitted Date', 'Message'];
    const rows = leads.map(l => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${(l.property_title || '').replace(/"/g, '""')}"`,
      `"${l.lead_type || ''}"`,
      `"${l.status || 'New'}"`,
      `"${new Date(l.created_at).toLocaleString('en-IN')}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `questspaces_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await getAllLeads({ status: statusFilter, search });
      setLeads(data || []);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, search]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeadStatus(id, newStatus);
      await fetchLeads();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!leadToDelete) return;
    setIsDeleting(true);
    try {
      await deleteLead(leadToDelete.id);
      setLeadToDelete(null);
      await fetchLeads();
    } catch (err) {
      alert(err.message || 'Failed to delete lead');
    } finally {
      setIsDeleting(false);
    }
  };

  const newCount = leads.filter(l => l.status === 'New').length;
  const contactedCount = leads.filter(l => l.status === 'Contacted').length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-md font-bold text-3xl text-primary mb-1">Leads & Inquiries</h1>
          <p className="text-on-surface-variant text-sm">Manage client inquiries, site visit requests, and callback bookings.</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={!leads.length}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full font-label-bold text-xs transition-colors shadow-sm disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export CSV (Excel)
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
            <span className="material-symbols-outlined">inbox</span>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Total Leads</div>
            <div className="text-2xl font-bold text-slate-900">{leads.length}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            <span className="material-symbols-outlined">mark_email_unread</span>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">New / Uncontacted</div>
            <div className="text-2xl font-bold text-slate-900">{newCount}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Contacted</div>
            <div className="text-2xl font-bold text-slate-900">{contactedCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/30 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search leads by name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:bg-white transition-colors"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          {['All', 'New', 'Contacted', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                statusFilter === st ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500 font-medium">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">person_search</span>
            <h3 className="font-bold text-slate-700 text-lg mb-1">No leads found</h3>
            <p className="text-slate-500 text-sm">Leads submitted via the website booking forms will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs uppercase font-label-bold tracking-wider text-slate-500">
                  <th className="py-4 px-6">Client Name</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4">Interested In</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Submitted</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {lead.name}
                    </td>

                    <td className="py-4 px-4 text-xs space-y-0.5">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                      </div>
                      {lead.email && (
                        <div className="text-slate-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">mail</span>
                          <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-800 text-xs">
                      {lead.property_title || 'General Inquiry'}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                        {lead.lead_type || 'VIP Booking'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-500">
                      {new Date(lead.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={lead.status || 'New'}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                          lead.status === 'New'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : lead.status === 'Contacted'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setLeadToDelete(lead)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Lead"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!leadToDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete lead from "${leadToDelete?.name}"?`}
        confirmText="Delete"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setLeadToDelete(null)}
      />
    </div>
  );
}
