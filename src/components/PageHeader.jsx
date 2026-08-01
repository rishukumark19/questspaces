import React from 'react';

export default function PageHeader({ eyebrow, title, subtitle, bgLight = true }) {
  return (
    <section className={`py-section-gap border-b border-outline-variant/20 ${bgLight ? 'bg-surface-container-lowest' : 'bg-surface-container-low'}`}>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="max-w-[800px] mx-auto text-center">
          {eyebrow && (
            <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block mb-3">
              {eyebrow}
            </span>
          )}
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight mb-5">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
