import React, { useState, useEffect } from 'react';
import { submitLead } from '../lib/leads';

export default function VIPBookingModal({ isOpen, onClose, propertyTitle }) {
  const [submitted, setSubmitted] = useState(false);
  const getLocationOption = (title) => {
    if (!title) return 'Hebbal';
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('yelahanka') || lowerTitle.includes('visista')) return 'Yelahanka';
    if (lowerTitle.includes('manyata') || lowerTitle.includes('mirabelle')) return 'Manyata Tech Park';
    if (lowerTitle.includes('devanahalli') || lowerTitle.includes('aeropolis')) return 'Devanahalli';
    if (lowerTitle.includes('thanisandra') || lowerTitle.includes('quiet earth')) return 'Thanisandra';
    return 'Hebbal';
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: getLocationOption(propertyTitle),
    budget: '₹2.5 Cr - ₹3.5 Cr',
    intent: 'Buying Residence'
  });

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setFormData(prev => ({
        ...prev,
        location: getLocationOption(propertyTitle)
      }));
    }
  }, [isOpen, propertyTitle]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        propertyTitle: propertyTitle || `Corridor: ${formData.location}`,
        leadType: 'VIP Booking',
        message: `Budget: ${formData.budget} | Intent: ${formData.intent}`
      });
    } catch (err) {
      console.error('Lead submission warning:', err);
    }
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <span className="material-symbols-outlined text-[56px] text-green-600 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <h3 className="font-headline-md text-headline-md text-primary mb-2">
              Consultation Scheduled!
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant mb-6">
              Thank you, <strong className="text-primary">{formData.name}</strong>. Vivek Anand's senior property advisory team will call you within 2 hours at <strong>{formData.phone}</strong>.
            </p>
            <div className="p-3 bg-surface-container-low rounded-lg text-xs font-semibold text-secondary mb-6">
              📍 Private Consultation Brief for {formData.location} | Budget: {formData.budget}
            </div>
            <button onClick={onClose} className="w-full bg-primary text-white py-3 rounded-lg font-label-bold text-label-bold uppercase tracking-wider hover:bg-primary-container transition-colors cursor-pointer border-none">
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-secondary text-lg">calendar_month</span>
              <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block">VIP PRIVATE SESSION</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-2">
              Schedule Advisory Consultation
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant mb-6">
              Speak directly with Quest Spaces senior real estate strategists in Bengaluru. Zero pressure, complete transparency.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="vip-name">Full Name *</label>
                <input 
                  id="vip-name"
                  type="text" 
                  required 
                  className="w-full bg-surface-bright border-b border-outline-variant/50 focus:border-primary-container focus:ring-0 px-0 py-2 font-body-md text-on-surface transition-colors outline-none" 
                  placeholder="e.g. Amit Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="vip-phone">Phone Number *</label>
                  <input 
                    id="vip-phone"
                    type="tel" 
                    required 
                    pattern="[0-9+\s\-]{10,15}"
                    title="Please enter a valid 10 to 15 digit contact number"
                    className="w-full bg-surface-bright border-b border-outline-variant/50 focus:border-primary-container focus:ring-0 px-0 py-2 font-body-md text-on-surface transition-colors outline-none" 
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="vip-email">Email Address</label>
                  <input 
                    id="vip-email"
                    type="email" 
                    className="w-full bg-surface-bright border-b border-outline-variant/50 focus:border-primary-container focus:ring-0 px-0 py-2 font-body-md text-on-surface transition-colors outline-none" 
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest mb-1.5" htmlFor="vip-location">Corridor</label>
                  <select 
                    id="vip-location"
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container p-2.5 text-xs font-body-md text-on-surface transition-colors outline-none cursor-pointer"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option value="Hebbal">Hebbal</option>
                    <option value="Yelahanka">Yelahanka</option>
                    <option value="Manyata Tech Park">Manyata Tech Park</option>
                    <option value="Devanahalli">Devanahalli</option>
                    <option value="Thanisandra">Thanisandra</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest mb-1.5" htmlFor="vip-budget">Budget</label>
                  <select 
                    id="vip-budget"
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container p-2.5 text-xs font-body-md text-on-surface transition-colors outline-none cursor-pointer"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  >
                    <option value="₹1.5 Cr - ₹2.5 Cr">₹1.5 Cr - ₹2.5 Cr</option>
                    <option value="₹2.5 Cr - ₹3.5 Cr">₹2.5 Cr - ₹3.5 Cr</option>
                    <option value="₹3.5 Cr - ₹5 Cr">₹3.5 Cr - ₹5 Cr</option>
                    <option value="₹5 Cr+">₹5 Cr+</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest mb-1.5" htmlFor="vip-intent">Advisory Intent</label>
                  <select 
                    id="vip-intent"
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container p-2.5 text-xs font-body-md text-on-surface transition-colors outline-none cursor-pointer"
                    value={formData.intent}
                    onChange={(e) => setFormData({ ...formData, intent: e.target.value })}
                  >
                    <option value="Buying Residence">Buying Residence</option>
                    <option value="Investment & ROI">Investment & ROI</option>
                    <option value="NRI Portfolio Advisory">NRI Advisory</option>
                    <option value="Site Visit & Brochure">Site Visit / Brochure</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 pt-2">
                <span className="material-symbols-outlined text-sm">gpp_good</span> 100% Data Confidentiality & Zero Telemarketing Spam Guarantee
              </div>

              <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-lg font-label-bold text-label-bold uppercase tracking-widest hover:bg-primary-container transition-colors shadow-sm mt-4 cursor-pointer border-none">
                Confirm VIP Appointment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
