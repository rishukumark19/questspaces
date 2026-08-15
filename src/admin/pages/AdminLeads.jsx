import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllLeads, updateLeadStatus, updateLeadNote, deleteLead } from '../../lib/leads';
import ConfirmDialog from '../components/ConfirmDialog';
import LeadDetailDrawer from '../components/LeadDetailDrawer';
import { useToast } from '../hooks/useToast';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function AdminLeads() {
  useDocumentTitle('Client Inquiries');

  const toast = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('created_at');
  const [sortDesc, setSortDesc] = useState(true);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState(new Set());

  const handleBulkMarkContacted = async () => {
    if (selectedLeadIds.size === 0) return;
    try {
      const promises = Array.from(selectedLeadIds).map(id => updateLeadStatus(id, 'Contacted'));
      await Promise.all(promises);
      toast.success(`${selectedLeadIds.size} leads marked as Contacted`);
      setLeads(leads.map(l => selectedLeadIds.has(l.id) ? { ...l, status: 'Contacted' } : l));
      setSelectedLeadIds(new Set());
    } catch (err) {
      toast.error('Failed to update some leads');
    }
  };

  const handleExportCSV = () => {
    const leadsToExport = selectedLeadIds.size > 0 
      ? sortedLeads.filter(l => selectedLeadIds.has(l.id))
      : sortedLeads;
      
    if (!leadsToExport.length) return;
    const headers = ['Client Name', 'Phone', 'Email', 'Property/Corridor', 'Lead Type', 'Status', 'Submitted Date', 'Message', 'Internal Note', 'Is Priority'];
    const rows = leadsToExport.map(l => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${(l.property_title || '').replace(/"/g, '""')}"`,
      `"${l.lead_type || ''}"`,
      `"${l.status || 'New'}"`,
      `"${new Date(l.created_at).toLocaleString('en-IN')}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${(l.note || '').replace(/"/g, '""')}"`,
      `"${l.is_priority ? 'Yes' : 'No'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `questspaces-leads-${new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }).replace(' ', '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const location = useLocation();
  const navigate = useNavigate();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await getAllLeads({ status: statusFilter, search });
      setLeads(data || []);
      
      const queryParams = new URLSearchParams(location.search);
      const leadIdToOpen = queryParams.get('id');
      
      if (leadIdToOpen) {
        const lead = data.find(l => l.id === leadIdToOpen);
        if (lead) {
          setSelectedLead(lead);
          navigate('/admin/leads', { replace: true });
        }
      } else if (selectedLead) {
        const updatedSelected = data.find(l => l.id === selectedLead.id);
        if (updatedSelected) {
          setSelectedLead(updatedSelected);
        }
      }
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
      toast.success('Lead status updated');
      // Optimistic update
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleNoteChange = async (id, note) => {
    try {
      await updateLeadNote(id, note);
      toast.success('Note saved successfully');
      // Optimistic update
      setLeads(leads.map(l => l.id === id ? { ...l, note: note } : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, note: note });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save note');
    }
  };

  const handlePriorityToggle = async (id, currentPriority) => {
    // Optimistic update
    const newPriority = !currentPriority;
    setLeads(leads.map(l => l.id === id ? { ...l, is_priority: newPriority } : l));
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, is_priority: newPriority });
    }
    
    // We import updateLeadPriority from leads.js (which we'll add next)
    try {
      const { updateLeadPriority } = await import('../../lib/leads');
      if (updateLeadPriority) {
         await updateLeadPriority(id, newPriority);
      }
    } catch (err) {
      // Revert if failed
      setLeads(leads.map(l => l.id === id ? { ...l, is_priority: currentPriority } : l));
      toast.error('Failed to update priority. Database column may be missing.');
    }
  };

  const handleDelete = async () => {
    if (!leadToDelete) return;
    setIsDeleting(true);
    try {
      await deleteLead(leadToDelete.id);
      toast.success('Lead deleted');
      setLeadToDelete(null);
      if (selectedLead && selectedLead.id === leadToDelete.id) {
        setSelectedLead(null);
      }
      await fetchLeads();
    } catch (err) {
      toast.error(err.message || 'Failed to delete lead');
    } finally {
      setIsDeleting(false);
    }
  };

  const newCount = leads.filter(l => l.status === 'New').length;
  const contactedCount = leads.filter(l => l.status === 'Contacted').length;
  const closedCount = leads.filter(l => l.status === 'Closed').length;
  const conversionRate = leads.length > 0 ? Math.round((closedCount / leads.length) * 100) : 0;

  const isUrgent = (lead) => {
    if (lead.status !== 'New') return false;
    const hours = (new Date() - new Date(lead.created_at)) / (1000 * 60 * 60);
    return hours > 48; // Changed from 24h to 48h
  };
  
  const overdueLeads = leads.filter(isUrgent);

  // Sorting logic
  const sortedLeads = [...leads].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    
    if (sortField === 'status') {
      const statusWeight = { 'New': 1, 'Contacted': 2, 'Closed': 3 };
      valA = statusWeight[a.status || 'New'];
      valB = statusWeight[b.status || 'New'];
    }
    
    if (valA < valB) return sortDesc ? 1 : -1;
    if (valA > valB) return sortDesc ? -1 : 1;
    return 0;
  });

  const toggleSort = (field) => {
    if (sortField === field) setSortDesc(!sortDesc);
    else { setSortField(field); setSortDesc(true); }
  };

  const currentLeadIndex = selectedLead ? sortedLeads.findIndex(l => l.id === selectedLead.id) : -1;
  const handlePrevLead = currentLeadIndex > 0 ? () => setSelectedLead(sortedLeads[currentLeadIndex - 1]) : null;
  const handleNextLead = currentLeadIndex < sortedLeads.length - 1 && currentLeadIndex !== -1 ? () => setSelectedLead(sortedLeads[currentLeadIndex + 1]) : null;

  return (
    <div className="p-8 max-w-7xl mx-auto font-body-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-md font-bold text-3xl text-primary mb-1">Client Inquiries</h1>
          <p className="text-on-surface-variant text-sm">Manage site visit requests, callbacks, and direct inquiries.</p>
        </div>
          <div className="flex gap-2">
            {selectedLeadIds.size > 0 && (
              <button
                onClick={handleBulkMarkContacted}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-label-bold text-xs transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">done_all</span>
                Mark Contacted
              </button>
            )}
            <button
              onClick={handleExportCSV}
              disabled={!sortedLeads.length}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full font-label-bold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              {selectedLeadIds.size > 0 
                ? `Export ${selectedLeadIds.size} Selected` 
                : `Export ${statusFilter !== 'All' ? statusFilter : sortedLeads.length} Leads`}
            </button>
          </div>
      </div>

      {/* Overdue Banner */}
      {overdueLeads.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-red-700">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-red-500 animate-pulse">warning</span>
            <div>
              <h4 className="font-bold text-sm">Action Required</h4>
              <p className="text-xs mt-0.5">You have {overdueLeads.length} new leads waiting for over 48 hours. Quick follow-ups increase conversions.</p>
            </div>
          </div>
          <button 
            onClick={() => { setStatusFilter('New'); setSortField('created_at'); setSortDesc(true); }}
            className="px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition-colors"
          >
            View Overdue
          </button>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
            <span className="material-symbols-outlined">inbox</span>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Total Leads</div>
            <div className="text-2xl font-bold text-slate-900">{leads.length}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl relative z-10">
            <span className="material-symbols-outlined">mark_email_unread</span>
          </div>
          <div className="relative z-10">
            <div className="text-xs uppercase font-bold text-slate-400">New / Uncontacted</div>
            <div className="text-2xl font-bold text-slate-900">{newCount}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Closed Rate</div>
            <div className="text-2xl font-bold text-slate-900">{conversionRate}%</div>
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
          <div className="p-16 text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <span className="material-symbols-outlined text-4xl text-slate-400">
                {search || statusFilter !== 'All' ? 'search_off' : 'inbox'}
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              {search || statusFilter !== 'All' ? 'No matching leads' : 'Inbox is empty'}
            </h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              {search || statusFilter !== 'All' 
                ? 'Try adjusting your search terms or clearing the status filter.' 
                : 'Inquiries submitted via your website will automatically appear here.'}
            </p>
            {(search || statusFilter !== 'All') && (
              <button 
                onClick={() => { setSearch(''); setStatusFilter('All'); }} 
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] uppercase font-bold tracking-wider text-slate-500 cursor-pointer select-none">
                  <th className="py-4 px-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer w-4 h-4"
                      checked={sortedLeads.length > 0 && selectedLeadIds.size === sortedLeads.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeadIds(new Set(sortedLeads.map(l => l.id)));
                        } else {
                          setSelectedLeadIds(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="py-4 px-2 text-left">Client Name</th>
                  <th className="py-4 px-4 text-left">Contact Info</th>
                  <th className="py-4 px-4 text-left">Interested In</th>
                  <th className="py-4 px-4 text-left hover:bg-slate-100 transition-colors" onClick={() => toggleSort('created_at')}>
                    <div className="flex items-center gap-1">
                      Submitted
                      {sortField === 'created_at' && <span className="material-symbols-outlined text-[14px]">{sortDesc ? 'arrow_downward' : 'arrow_upward'}</span>}
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left hover:bg-slate-100 transition-colors" onClick={() => toggleSort('status')}>
                    <div className="flex items-center gap-1">
                      Status
                      {sortField === 'status' && <span className="material-symbols-outlined text-[14px]">{sortDesc ? 'arrow_downward' : 'arrow_upward'}</span>}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    onClick={() => setSelectedLead(lead)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors group ${selectedLeadIds.has(lead.id) ? 'bg-primary/5 hover:bg-primary/10' : ''}`}
                  >
                    <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer w-4 h-4"
                        checked={selectedLeadIds.has(lead.id)}
                        onChange={(e) => {
                          const newSet = new Set(selectedLeadIds);
                          if (e.target.checked) newSet.add(lead.id);
                          else newSet.delete(lead.id);
                          setSelectedLeadIds(newSet);
                        }}
                      />
                    </td>
                    <td className="py-4 px-2 relative">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handlePriorityToggle(lead.id, lead.is_priority); }}
                          className={`flex-shrink-0 transition-colors ${lead.is_priority ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'}`}
                          title={lead.is_priority ? "Remove Priority" : "Mark High Priority"}
                        >
                          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: lead.is_priority ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                        </button>
                        <div>
                          <div className="font-bold text-slate-900 text-sm mb-0.5 group-hover:text-primary transition-colors flex items-center gap-2">
                            {lead.name}
                            {isUrgent(lead) && (
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Needs attention (over 48h)"></span>
                            )}
                            {lead.note && (
                              <span className="material-symbols-outlined text-[14px] text-blue-500" title="Has internal note">sticky_note_2</span>
                            )}
                          </div>
                          <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                            {lead.lead_type || 'Inquiry'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs space-y-1">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">call</span>
                        <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} className="hover:underline hover:text-primary">{lead.phone}</a>
                      </div>
                      {lead.email && (
                        <div className="text-slate-500 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-slate-400">mail</span>
                          <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()} className="hover:underline hover:text-primary">{lead.email}</a>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800 text-sm max-w-[200px] truncate">
                        {lead.property_title || 'General Inquiry'}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-sm font-semibold text-slate-700">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(lead.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {isUrgent(lead) && (
                        <div className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">Needs Attention</div>
                      )}
                    </td>

                    <td className="py-4 px-4" onClick={e => e.stopPropagation()}>
                      {/* Text Pills instead of Icons */}
                      <div className="flex gap-2 relative z-10 w-max">
                        <select
                          value={lead.status || 'New'}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`appearance-none font-bold text-xs px-3 py-1.5 rounded-lg border outline-none cursor-pointer pr-8 ${
                            (lead.status || 'New') === 'New' 
                              ? 'bg-amber-50 text-amber-700 border-amber-200' 
                              : lead.status === 'Contacted' 
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <option value="New">New Lead</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none opacity-50">
                          expand_more
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                          }}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLeadToDelete(lead);
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Lead"
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

      <LeadDetailDrawer 
        lead={selectedLead} 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLead(null)} 
        onStatusChange={handleStatusChange}
        onNoteChange={handleNoteChange}
        onPrev={handlePrevLead}
        onNext={handleNextLead}
      />

      <ConfirmDialog
        isOpen={!!leadToDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete lead from "${leadToDelete?.name}"?`}
        confirmText="Delete"
        theme="red"
        icon="warning"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setLeadToDelete(null)}
      />
    </div>
  );
}
