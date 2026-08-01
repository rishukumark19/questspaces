import React from 'react';

export default function StickyActionables({ onOpenVIPModal }) {
  return (
    <>
      {/* Mobile Sticky Bottom Bar (shown only on mobile/tablet) */}
      <div className="fixed bottom-0 left-0 w-full z-45 bg-surface/95 backdrop-blur-md border-t border-outline-variant/30 px-4 py-3 flex justify-between items-center gap-3 shadow-2xl lg:hidden">
        <a 
          href="https://wa.me/917411736908?text=Hello%20Questspaces%20Team%2C%20I%20am%20interested%20in%20learning%20more%20about%20your%20Bengaluru%20properties."
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-[#25D366] text-white py-3 rounded-lg flex items-center justify-center transition-colors"
          title="WhatsApp"
          aria-label="Chat with us on WhatsApp"
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
        </a>

        <a 
          href="tel:+917411736908"
          className="flex-1 bg-surface-container-high border border-outline-variant/40 text-primary py-3 rounded-lg flex items-center justify-center transition-colors"
          title="Call"
          aria-label="Call our support team"
        >
          <span className="material-symbols-outlined text-lg text-secondary">phone_in_talk</span>
        </a>

        <button 
          onClick={onOpenVIPModal}
          className="flex-1 bg-gold text-primary border-none py-3 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          title="VIP Booking"
          aria-label="Book a VIP consultation callback"
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
        </button>
      </div>

      {/* Desktop Floating Actions (hidden on mobile) */}
      <div className="hidden lg:flex fixed bottom-5 right-5 z-40 flex-col gap-3">
        {/* WhatsApp Action */}
        <a 
          href="https://wa.me/917411736908?text=Hello%20Questspaces%20Team%2C%20I%20am%20interested%20in%20learning%20more%20about%20your%20Bengaluru%20properties."
          target="_blank"
          rel="noreferrer"
          className="bg-[#25D366] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          title="Chat on WhatsApp"
          aria-label="Chat with us on WhatsApp"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
        </a>

        {/* Call Action */}
        <a 
          href="tel:+917411736908"
          className="bg-surface-container-lowest border border-outline-variant/30 text-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          title="Call Advisory"
          aria-label="Call our support team"
        >
          <span className="material-symbols-outlined text-xl text-secondary">phone_in_talk</span>
        </a>

        {/* Quick VIP Inquiry */}
        <button 
          onClick={onOpenVIPModal}
          className="bg-gold text-primary border-none w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
          title="Quick VIP Booking"
          aria-label="Book a VIP consultation callback"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
        </button>
      </div>
    </>
  );
}
