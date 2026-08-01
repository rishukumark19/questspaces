import React from 'react';

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.099 4.017 4.007-1.066zm10.741-6.136c-.161-.268-.592-.429-1.238-.752-.647-.323-3.818-1.884-4.41-2.099-.593-.216-1.024-.323-1.455.323-.431.647-1.671 2.099-2.048 2.529-.377.431-.754.538-1.399.215-2.883-1.439-4.787-2.585-6.685-5.839-.5-8.58 1.488-.162 1.993-.323 2.477.162.484.323.753.647.753.323 0 .646-.107 1.293-.43.646-.323 2.1-1.346 2.476-1.776.377-.43.377-.808.269-1.185-.108-.377-.969-2.336-1.328-3.2-.358-.863-.725-.745-1.054-.76-.301-.015-.646-.015-.991-.015-.345 0-.915.129-1.399.646-.484.517-1.852 1.81-1.852 4.414 0 2.604 1.896 5.122 2.164 5.488.269.366 3.734 5.702 9.047 7.996 4.423 1.91 5.324 1.53 6.293 1.44 1.077-.101 2.476-1.011 2.825-1.988.35-.978.35-1.817.242-1.993z"/>
  </svg>
);

export default function StickyActionables({ onOpenVIPModal }) {
  return (
    <>
      {/* Mobile Sticky Bottom Bar (shown only on mobile/tablet) */}
      <div className="fixed bottom-0 left-0 w-full z-45 bg-surface/95 backdrop-blur-md border-t border-outline-variant/30 px-4 py-3 flex justify-between items-center gap-3 shadow-2xl lg:hidden">
        <a 
          href="https://wa.me/917411736908?text=Hello%20Questspaces%20Team%2C%20I%20am%20interested%20in%20learning%20more%20about%20your%20Bengaluru%20properties."
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-surface-container-high border border-outline-variant/40 text-[#25D366] hover:bg-[#25D366] hover:text-white py-3 rounded-lg flex items-center justify-center transition-colors"
          title="WhatsApp"
          aria-label="Chat with us on WhatsApp"
        >
          <WhatsAppIcon />
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
          className="bg-surface-container-lowest border border-outline-variant/30 text-[#25D366] hover:bg-[#25D366] hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all"
          title="Chat on WhatsApp"
          aria-label="Chat with us on WhatsApp"
        >
          <WhatsAppIcon />
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
