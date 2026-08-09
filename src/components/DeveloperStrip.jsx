import React from 'react';
import { DEVELOPERS } from '../data/micromarkets';

export default function DeveloperStrip() {
  // Duplicate array for seamless infinite scroll
  const duplicatedDevelopers = [...DEVELOPERS, ...DEVELOPERS, ...DEVELOPERS];

  return (
    <section className="py-20 bg-surface-container-lowest border-y border-outline-variant/30 overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12 text-center">
        <h2 className="text-[12px] md:text-[14px] uppercase tracking-[0.3em] font-bold text-secondary mb-2">
          Prestigious Developer Network
        </h2>
        <div className="h-px w-24 bg-gold mx-auto opacity-50"></div>
      </div>

      <div className="relative flex overflow-hidden w-full group mask-image-fade">
        <div className="flex w-max animate-marquee items-center gap-2 md:gap-4 px-8">
          {duplicatedDevelopers.map((dev, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 flex items-center justify-center transition-all duration-500 h-[100px] md:h-[180px] mx-4 md:mx-6"
            >
              <img 
                src={dev.logo} 
                alt={`${dev.name} Logo`}
                className="h-full w-auto object-contain transition-all duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Define mask-image for fading edges in CSS or inline style if needed. Tailwind might need a custom class or inline style. */}
      <style dangerouslySetInnerHTML={{__html: `
        .mask-image-fade {
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}} />
    </section>
  );
}
