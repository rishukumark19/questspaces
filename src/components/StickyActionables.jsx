import React from 'react';

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.573-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.14 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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
          className="flex-1 bg-gold text-primary border-none py-3 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
          title="Request Callback"
          aria-label="Book a VIP consultation callback"
        >
          <span className="material-symbols-outlined text-lg">phone_callback</span>
          <span className="font-label-bold text-[11px] uppercase tracking-wider hidden sm:inline">Callback</span>
        </button>
      </div>

      {/* Desktop Floating Actions (hidden on mobile) */}
      <div className="hidden lg:flex fixed bottom-5 right-5 z-40 flex-col gap-3">
        {/* WhatsApp Action */}
        <a 
          href="https://wa.me/917411736908?text=Hello%20Questspaces%20Team%2C%20I%20am%20interested%20in%20learning%20more%20about%20your%20Bengaluru%20properties."
          target="_blank"
          rel="noreferrer"
          className="group relative bg-surface-container-lowest border border-outline-variant/30 text-[#25D366] hover:bg-[#25D366] hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all"
          aria-label="Chat with us on WhatsApp"
        >
          <WhatsAppIcon />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-surface-container-high text-on-surface text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm border border-outline-variant/20">
            Chat on WhatsApp
          </span>
        </a>

        {/* Call Action */}
        <a 
          href="tel:+917411736908"
          className="group relative bg-surface-container-lowest border border-outline-variant/30 text-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          aria-label="Call our support team"
        >
          <span className="material-symbols-outlined text-xl text-secondary">phone_in_talk</span>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-surface-container-high text-on-surface text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm border border-outline-variant/20">
            Call Advisory
          </span>
        </a>

        {/* Quick VIP Inquiry */}
        <button 
          onClick={onOpenVIPModal}
          className="group relative bg-gold text-primary border-none w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
          aria-label="Book a consultation callback"
        >
          <span className="material-symbols-outlined text-xl">phone_callback</span>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-surface-container-high text-on-surface text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm border border-outline-variant/20">
            Request Callback
          </span>
        </button>
      </div>
    </>
  );
}
