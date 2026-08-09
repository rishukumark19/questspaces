import React from 'react';

export default function StatusBadge({ publishState }) {
  const styles = {
    published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    draft: 'bg-amber-100 text-amber-800 border-amber-200',
    archived: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const labels = {
    published: 'Published',
    draft: 'Draft',
    archived: 'Archived',
  };

  const style = styles[publishState] || styles.draft;
  const label = labels[publishState] || publishState;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${publishState === 'published' ? 'bg-emerald-500' : publishState === 'draft' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
      {label}
    </span>
  );
}
