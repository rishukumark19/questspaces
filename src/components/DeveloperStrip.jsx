import React from 'react';
import { DEVELOPERS } from '../data/micromarkets';

export default function DeveloperStrip({ lightBg = false }) {
  // Duplicate array for seamless infinite scroll
  const duplicatedDevelopers = [...DEVELOPERS, ...DEVELOPERS];

  return (
    <section className={`py-12 border-t border-outline-variant/20 overflow-hidden ${lightBg ? 'bg-surface-container-lowest' : 'bg-[#0d1c32]'}`}>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-8 text-center">
        <span className={`text-xs uppercase tracking-[0.25em] font-extrabold block ${lightBg ? 'text-secondary' : 'text-gold'}`}>
          PRESTIGIOUS DEVELOPER NETWORK
        </span>
      </div>

      <div className="relative flex overflow-hidden w-full group">
        <div className="flex w-max animate-marquee items-center gap-10 px-5">
          {duplicatedDevelopers.map((dev, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 flex items-center justify-center rounded-xl p-3 transition-all duration-300 w-[160px] h-[90px] bg-white shadow-sm hover:shadow-lg border border-outline-variant/10"
            >
              <img 
                src={dev.logo} 
                alt={`${dev.name} Logo`}
                className="max-w-full max-h-full object-contain opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
