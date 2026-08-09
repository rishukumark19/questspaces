import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPropertyStats } from '../../lib/properties';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPropertyStats().then(data => {
      setStats(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Properties', value: stats?.total || 0, icon: 'real_estate_agent', color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Published', value: stats?.published || 0, icon: 'public', color: 'bg-green-500/10 text-green-600' },
    { label: 'Drafts', value: stats?.drafts || 0, icon: 'edit_document', color: 'bg-orange-500/10 text-orange-600' },
    { label: 'Featured', value: stats?.featured || 0, icon: 'star', color: 'bg-yellow-500/10 text-yellow-600' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-headline-md font-bold text-3xl text-primary mb-1">Dashboard</h1>
          <p className="text-on-surface-variant">Overview of your property portfolio.</p>
        </div>
        <Link 
          to="/admin/properties/new" 
          className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-full font-label-bold flex items-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Property
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.color}`}>
              <span className="material-symbols-outlined text-[28px]">{stat.icon}</span>
            </div>
            <div>
              <div className="text-on-surface-variant text-sm font-label-bold uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="font-headline-md font-bold text-3xl text-primary leading-none">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-outline-variant/30">
        <h2 className="font-headline-md font-bold text-xl text-primary mb-6">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/properties" className="flex items-center gap-3 px-6 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:bg-primary/5 transition-colors group">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">list</span>
            <div className="font-label-bold text-primary">Manage Properties</div>
          </Link>
          <Link to="/admin/leads" className="flex items-center gap-3 px-6 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:bg-primary/5 transition-colors group">
            <span className="material-symbols-outlined text-emerald-600 group-hover:scale-110 transition-transform">inbox</span>
            <div className="font-label-bold text-primary">View Leads & Inquiries</div>
          </Link>
          <Link to="/" target="_blank" className="flex items-center gap-3 px-6 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:bg-primary/5 transition-colors group">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">open_in_new</span>
            <div className="font-label-bold text-primary">View Public Website</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
