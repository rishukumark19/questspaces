import React from 'react';

export default function PropertyCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm animate-pulse">
      <div className="h-64 bg-slate-200 w-full relative">
        <div className="absolute top-4 left-4 h-6 w-20 bg-slate-300 rounded-full"></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-6 bg-slate-300 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="h-6 bg-slate-300 rounded w-1/3"></div>
          <div className="h-8 bg-slate-200 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  );
}
