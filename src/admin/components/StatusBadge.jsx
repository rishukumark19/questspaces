import React from 'react';

export default function StatusBadge({ publishState }) {
  const styles = {
    published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    draft: 'bg-amber-50 text-amber-700 border-amber-200',
    in_review: 'bg-blue-50 text-blue-700 border-blue-200',
    archived: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const icons = {
    published: 'public',
    draft: 'edit_document',
    in_review: 'pending_actions',
    archived: 'archive',
  };

  const labels = {
    published: 'Published',
    draft: 'Draft',
    in_review: 'In Review',
    archived: 'Archived',
  };

  const style = styles[publishState] || styles.draft;
  const icon = icons[publishState] || icons.draft;
  const label = labels[publishState] || publishState;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${style}`}>
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
      {label}
    </span>
  );
}
