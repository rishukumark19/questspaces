import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function AdminInsights() {
  useDocumentTitle('Manage Insights');
  const [activeTab, setActiveTab] = useState('published');

  const DUMMY_INSIGHTS = [
    {
      id: '1',
      title: 'North Bengaluru Real Estate Outlook',
      category: 'Market Analysis',
      status: 'published',
      date: 'Feb 2026',
      views: 1205
    },
    {
      id: '2',
      title: 'The NRI Property Investment Playbook',
      category: 'Investment Advisory',
      status: 'published',
      date: 'Jan 2026',
      views: 890
    },
    {
      id: '3',
      title: 'K-RERA Due Diligence Checks',
      category: 'Legal',
      status: 'draft',
      date: 'Pending',
      views: 0
    }
  ];

  const filtered = DUMMY_INSIGHTS.filter(i => i.status === activeTab);

  return (
    <div className="p-8 max-w-7xl mx-auto font-body-md min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-headline-md font-bold text-3xl text-slate-900 mb-2">Research & Insights</h1>
          <p className="text-slate-500 font-medium">Manage market analysis reports, advisory playbooks, and insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-primary text-gold px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:scale-95 transition-transform flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span> Create Insight
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 flex-1 flex flex-col overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-outline-variant/20 px-6">
          <button 
            onClick={() => setActiveTab('published')}
            className={`py-4 px-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'published' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Published ({DUMMY_INSIGHTS.filter(i => i.status === 'published').length})
          </button>
          <button 
            onClick={() => setActiveTab('draft')}
            className={`py-4 px-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'draft' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Drafts ({DUMMY_INSIGHTS.filter(i => i.status === 'draft').length})
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-auto p-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <span className="material-symbols-outlined text-5xl mb-4 text-slate-300">article</span>
              <p>No insights found in this view.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(insight => (
                <div key={insight.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{insight.title}</h3>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                      <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded">{insight.category}</span>
                      <span>{insight.date}</span>
                      {insight.status === 'published' && (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <span className="material-symbols-outlined text-[14px]">visibility</span> {insight.views} views
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">Edit</button>
                    <button className="bg-white border border-slate-200 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
