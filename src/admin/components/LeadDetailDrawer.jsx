import React, { useState, useEffect } from 'react';

export default function LeadDetailDrawer({ lead, isOpen, onClose, onStatusChange, onNoteChange, onPrev, onNext }) {
  const [note, setNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (lead) {
      setNote(lead.note || '');
      setCopiedField(null);
    }
  }, [lead]);

  useEffect(() => {
    if (!isOpen || !lead) return;

    const handleKeyDown = (e) => {
      // Don't intercept arrow keys if typing in textarea/input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, lead, onClose, onPrev, onNext]);

  if (!isOpen || !lead) return null;

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveNote = async () => {
    setIsSavingNote(true);
    await onNoteChange(lead.id, note);
    setIsSavingNote(false);
  };

  const statusOptions = [
    { 
      value: 'New', 
      label: 'New Lead', 
      activeStyles: 'bg-slate-900 text-white font-medium border-slate-900',
      inactiveStyles: 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-800'
    },
    { 
      value: 'Contacted', 
      label: 'Contacted', 
      activeStyles: 'bg-blue-600 text-white font-medium border-blue-600',
      inactiveStyles: 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-700'
    },
    { 
      value: 'Closed', 
      label: 'Closed', 
      activeStyles: 'bg-emerald-600 text-white font-medium border-emerald-600',
      inactiveStyles: 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 relative">
          <div className="flex-1 mr-4">
            <h2 className="text-xl font-bold text-slate-900 line-clamp-1">{lead.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600">
                {lead.lead_type || 'Inquiry'}
              </span>
              <span className="text-xs text-slate-500">
                {new Date(lead.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mr-2">
              <button 
                onClick={onPrev}
                disabled={!onPrev}
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-slate-200"
                title="Previous Lead"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button 
                onClick={onNext}
                disabled={!onNext}
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next Lead"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors shrink-0 bg-white shadow-sm border border-slate-200"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* Contact Info Group */}
          <div className="space-y-4">
            
            {/* Phone Group */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <span className="material-symbols-outlined text-[16px]">smartphone</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</div>
                    <div className="font-medium text-slate-900 text-sm mt-0.5">{lead.phone}</div>
                  </div>
                </div>
                {lead.phone && (
                  <button
                    type="button"
                    onClick={() => handleCopy(lead.phone, 'phone')}
                    className="text-xs text-slate-400 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedField === 'phone' ? 'check' : 'content_copy'}
                    </span>
                    {copiedField === 'phone' ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <a href={`tel:${lead.phone}`} style={{ color: '#ffffff' }} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
                  <span className="material-symbols-outlined text-[16px]" style={{ color: '#ffffff' }}>call</span> Call
                </a>
                <a 
                  href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(lead.name.split(' ')[0])},%20I'm%20reaching%20out%20regarding%20your%20inquiry.`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: '#ffffff' }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#25D366] hover:bg-[#20bd5a] rounded-lg text-sm font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]" style={{ color: '#ffffff' }}>forum</span> WhatsApp
                </a>
              </div>
            </div>

            {/* Email Group */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</div>
                    {lead.email ? (
                      <div className="font-medium text-slate-900 text-sm mt-0.5 truncate" title={lead.email}>{lead.email}</div>
                    ) : (
                      <div className="text-xs text-slate-400 italic mt-0.5">Not Provided</div>
                    )}
                  </div>
                </div>
                {lead.email && (
                  <button
                    type="button"
                    onClick={() => handleCopy(lead.email, 'email')}
                    className="text-xs text-slate-400 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedField === 'email' ? 'check' : 'content_copy'}
                    </span>
                    {copiedField === 'email' ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              {lead.email && (
                <div className="pt-3 border-t border-slate-100">
                  <a href={`mailto:${lead.email}`} className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                    <span className="material-symbols-outlined text-[16px]">mail</span> Send Email
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Property Inquiry Details */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 mb-3">Inquiry Details</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Property of Interest</div>
              <div className="font-medium text-slate-900 text-sm mb-4">{lead.property_title || 'General Inquiry'}</div>
              
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Message</div>
              {lead.message ? (
                <div className="text-sm text-slate-700 bg-white border border-slate-100 rounded-lg p-3 whitespace-pre-wrap leading-relaxed">
                  "{lead.message}"
                </div>
              ) : (
                <div className="text-sm text-slate-400 italic">No message provided.</div>
              )}
            </div>
          </div>

          {/* Status Buttons */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 mb-3">Pipeline Status</h3>
            <div className="flex gap-2">
              {statusOptions.map(opt => {
                const isActive = (lead.status || 'New') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onStatusChange(lead.id, opt.value)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-colors cursor-pointer ${
                      isActive ? opt.activeStyles : opt.inactiveStyles
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">lock</span> Private Notes
              </h3>
              {isSavingNote && <span className="text-[10px] text-slate-400 flex items-center gap-1"><span className="material-symbols-outlined text-[12px] animate-spin">refresh</span> Saving...</span>}
            </div>
            <div className="relative">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onBlur={handleSaveNote}
                placeholder="Type private notes here... (Auto-saves on blur)"
                rows={4}
                className={`w-full bg-slate-50 border rounded-2xl p-4 text-sm outline-none focus:bg-white resize-none transition-colors ${isSavingNote ? 'border-primary shadow-sm' : 'border-slate-200 focus:border-primary focus:shadow-sm'}`}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
