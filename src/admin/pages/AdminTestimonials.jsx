import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function AdminTestimonials() {
  useDocumentTitle('Manage Testimonials');

  const DUMMY_TESTIMONIALS = [
    {
      id: '1',
      name: 'Priya Sharma',
      title: 'Tech Executive & Investor',
      status: 'active',
      date: 'Feb 10, 2026'
    },
    {
      id: '2',
      name: 'Vikram Reddy',
      title: 'NRI Investor, Dubai',
      status: 'active',
      date: 'Jan 22, 2026'
    },
    {
      id: '3',
      name: 'Anjali Desai',
      title: 'First-Time Homebuyer',
      status: 'active',
      date: 'Dec 05, 2025'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto font-body-md min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-headline-md font-bold text-3xl text-slate-900 mb-2">Testimonials</h1>
          <p className="text-slate-500 font-medium">Manage client testimonials shown on the Home page.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-primary text-gold px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:scale-95 transition-transform flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span> Add Testimonial
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 flex-1 flex flex-col overflow-hidden p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_TESTIMONIALS.map(testimonial => (
            <div key={testimonial.id} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className="material-symbols-outlined text-gold text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{testimonial.status}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{testimonial.name}</h3>
                <p className="text-slate-500 text-xs font-semibold mb-4">{testimonial.title}</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic border-l-2 border-slate-200 pl-3">"A short snippet of their review..."</p>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                <button className="flex-1 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">Edit</button>
                <button className="flex-1 bg-white border border-slate-200 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
