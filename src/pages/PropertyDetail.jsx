import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperty } from '../hooks/useProperty';
import { submitLead } from '../lib/leads';

export default function PropertyDetail({ savedIds, onToggleSave }) {
  const { id } = useParams();
  const { property, loading } = useProperty(id);

  const [activeImage, setActiveImage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [visitSubmitted, setVisitSubmitted] = useState(false);

  const [emiInterest] = useState(8.5);
  const [emiTenure] = useState(20);

  useEffect(() => {
    if (property) {
      setActiveImage(property.heroImage || (property.images && property.images[0]) || '');
    }
  }, [property]);

  if (loading || !property) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-surface">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-on-surface-variant font-label-bold text-sm">Loading luxury residence details...</p>
      </div>
    );
  }

  const priceVal = property.priceValue || 30000000;
  const r = emiInterest / 12 / 100;
  const n = emiTenure * 12;
  const emiAmount = Math.round(
    (priceVal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  );

  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const isSaved = savedIds.includes(property.id);

  const handleVisitSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements['pd-name']?.value || '';
    const phone = form.elements['pd-phone']?.value || '';
    const email = form.elements['pd-email']?.value || '';
    const message = form.elements['pd-message']?.value || '';

    try {
      await submitLead({
        name,
        phone,
        email,
        propertyTitle: property.title,
        leadType: 'Site Visit Request',
        message
      });
    } catch (err) {
      console.error('Lead submission warning:', err);
    }

    setVisitSubmitted(true);
  };

  const handleNextImage = () => {
    const nextIndex = (activeImageIndex + 1) % property.images.length;
    setActiveImageIndex(nextIndex);
    setActiveImage(property.images[nextIndex]);
  };

  const handlePrevImage = () => {
    const prevIndex = (activeImageIndex - 1 + property.images.length) % property.images.length;
    setActiveImageIndex(prevIndex);
    setActiveImage(property.images[prevIndex]);
  };

  // Split proximity into 3 categories for the location section
  const techParks = property.proximity.filter(p =>
    p.title.toLowerCase().includes('tech') ||
    p.title.toLowerCase().includes('park') ||
    p.title.toLowerCase().includes('business')
  );
  const healthcare = property.proximity.filter(p =>
    p.title.toLowerCase().includes('hospital') ||
    p.title.toLowerCase().includes('aster') ||
    p.title.toLowerCase().includes('manipal')
  );
  const connectivity = property.proximity.filter(p =>
    !techParks.includes(p) && !healthcare.includes(p)
  );

  // Map amenity name → material icon name
  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('butterfly') || n.includes('park') || n.includes('garden')) return 'nature_people';
    if (n.includes('cricket')) return 'sports_cricket';
    if (n.includes('gym') || n.includes('fitness')) return 'fitness_center';
    if (n.includes('volleyball') || n.includes('tennis') || n.includes('court')) return 'sports_volleyball';
    if (n.includes('pool') || n.includes('swimming')) return 'pool';
    if (n.includes('yoga') || n.includes('wellness')) return 'self_improvement';
    if (n.includes('cinema') || n.includes('theatre') || n.includes('amphitheatre')) return 'event_seat';
    if (n.includes('cafe') || n.includes('lounge')) return 'local_cafe';
    return 'star';
  };

  // Subtitle per amenity category
  const getSubtitle = (name) => {
    const n = name.toLowerCase();
    if (n.includes('butterfly') || n.includes('park')) return 'Landscaped nature zones';
    if (n.includes('cricket')) return 'Professional practice nets';
    if (n.includes('gym') || n.includes('fitness')) return 'State-of-the-art equipment';
    if (n.includes('volleyball')) return 'Professional court';
    if (n.includes('pool') || n.includes('swimming')) return 'Olympic-length pool';
    if (n.includes('amphitheatre')) return 'Social & cultural hub';
    if (n.includes('yoga')) return 'Holistic wellness space';
    if (n.includes('cinema')) return 'Open-air entertainment';
    if (n.includes('lounge') || n.includes('sky')) return 'Panoramic city views';
    return 'Premium amenity';
  };

  return (
    /*
     * Layout mirrors propertydetial.html exactly:
     * - body: bg-surface text-on-surface font-body-md antialiased
     * - main: pt-[100px] pb-section-gap  (section-gap = 120px)
     * - max-w-container-max (1280px) mx-auto px-margin-mobile md:px-margin-desktop (20px / 64px)
     * - left col gap-section-gap (120px between sections)
     * - sidebar sticky top-[120px]
     */
    <div className="bg-surface text-on-surface font-body-md antialiased">

      {/* ── Breadcrumb ────────────────────────────────────────── */}
      <div className="w-full bg-surface/70 backdrop-blur-xl border-b border-outline-variant/20 pt-[72px]">
        <div className="flex items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto font-label-sm text-label-sm text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
          <span className="mx-2">/</span>
          <span className="text-on-surface font-label-bold">{property.title}</span>
        </div>
      </div>

      {/* ── Main ──────────────────────────────────────────────── */}
      <main className="pt-stack-lg pb-section-gap">

        {/* ── Hero Gallery ──────────────────────────────────── */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-stack-lg">

          {/* Main hero image */}
          <div className="relative h-[300px] sm:h-[450px] md:h-[600px] lg:h-[716px] rounded-xl overflow-hidden image-border-protect group">
            <img
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={activeImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 via-transparent to-transparent pointer-events-none" />

            {/* Badges + save button top row */}
            <div className="absolute top-stack-md right-stack-md">
              <button
                onClick={() => onToggleSave(property)}
                className="glass-panel w-12 h-12 rounded-full flex items-center justify-center hover:bg-surface/90 transition-colors"
                aria-label="Save property"
              >
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Bottom row: badges + nav arrows */}
            <div className="absolute bottom-stack-md left-stack-md right-stack-md flex justify-between items-end">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-surface/20 backdrop-blur-md border border-surface/30 rounded-full font-label-sm text-label-sm text-on-tertiary uppercase tracking-widest"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handlePrevImage}
                  className="glass-panel p-3 rounded-full hover:bg-surface/90 transition-colors group/btn"
                >
                  <span className="material-symbols-outlined text-primary group-hover/btn:scale-110 transition-transform">
                    chevron_left
                  </span>
                </button>
                <button
                  onClick={handleNextImage}
                  className="glass-panel p-3 rounded-full hover:bg-surface/90 transition-colors group/btn"
                >
                  <span className="material-symbols-outlined text-primary group-hover/btn:scale-110 transition-transform">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="grid grid-cols-4 gap-2 md:gap-4 mt-4">
            {property.images.slice(0, 4).map((img, i) => (
              <div
                key={i}
                onClick={() => { setActiveImage(img); setActiveImageIndex(i); }}
                className={`h-24 md:h-32 rounded-lg overflow-hidden image-border-protect cursor-pointer transition-opacity relative ${
                  activeImage === img ? 'opacity-100 ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" src={img} />
                {i === 3 && property.images.length > 4 && (
                  <div className="absolute inset-0 bg-primary-container/40 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="font-label-bold text-label-bold text-white">
                      +{property.images.length - 4} Photos
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Main Content + Sidebar grid ───────────────────── */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter">

          {/* ── LEFT COLUMN ───────────────────────────────────── */}
          <div className="lg:col-span-8 flex flex-col gap-section-gap">

            {/* Section 1 · Header & Overview */}
            <section>
              <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface mb-4">
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-body-lg text-body-lg mb-8">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">location_on</span>
                  <span>{property.location}</span>
                </div>
                {property.reraId && (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <span className="material-symbols-outlined text-[16px]">verified</span> RERA Verified: {property.reraId}
                  </div>
                )}
                <a 
                  href={`https://wa.me/?text=Check out this premium property: ${property.title} in ${property.location}. Find out more on QuestSpaces!`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[#25D366] font-bold text-xs uppercase tracking-wider bg-[#25D366]/10 px-3 py-1 rounded-full border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">share</span> Share on WhatsApp
                </a>
              </div>

              {/* Quick specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 py-8 border-y border-outline-variant/30 mb-8">
                <div>
                  <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-1">Starting Price</p>
                  <p className="font-bold text-base sm:text-headline-sm md:text-headline-md text-on-surface">{property.startingPrice}</p>
                </div>
                <div>
                  <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-1">Configurations</p>
                  <p className="font-bold text-base sm:text-headline-sm md:text-headline-md text-on-surface">{property.bhkOptions.join(' & ')}</p>
                </div>
                <div>
                  <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-1">Land Parcel</p>
                  <p className="font-bold text-base sm:text-headline-sm md:text-headline-md text-on-surface">{property.landParcel}</p>
                </div>
                <div>
                  <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-1">Total Units</p>
                  <p className="font-bold text-base sm:text-headline-sm md:text-headline-md text-on-surface">{property.totalUnits}</p>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none text-on-surface-variant font-body-lg text-body-lg space-y-6">
                <p>{property.description}</p>
                <p>{property.longDescription}</p>
              </div>
            </section>

            {/* Section 2 · World-Class Amenities */}
            <section>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">
                World-Class Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {property.amenities.flatMap(cat => cat.list).slice(0, 6).map((amenity, i) => (
                  <div
                    key={i}
                    className="bg-surface-container-lowest p-6 rounded-lg premium-shadow border border-outline-variant/10 flex items-start gap-4"
                  >
                    <span className="material-symbols-outlined text-primary text-[32px]">
                      {getIcon(amenity)}
                    </span>
                    <div>
                      <h3 className="font-label-bold text-label-bold text-on-surface mb-1">{amenity}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm">{getSubtitle(amenity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 · Location Advantages */}
            <section>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">
                Strategic Location Advantage
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/20">
                  <h3 className="font-label-bold text-label-bold text-primary mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">business</span> Tech Parks
                  </h3>
                  <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                    {(techParks.length > 0 ? techParks : [
                      { title: 'Manyata Tech Park', distance: '10 mins' },
                      { title: 'Kirloskar Tech Park', distance: '5 mins' }
                    ]).map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.title}</span><span>{item.distance}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/20">
                  <h3 className="font-label-bold text-label-bold text-primary mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">medical_services</span> Healthcare
                  </h3>
                  <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                    {(healthcare.length > 0 ? healthcare : [
                      { title: 'Aster CMI Hospital', distance: '4 mins' },
                      { title: 'Manipal Hospital', distance: '6 mins' }
                    ]).map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.title}</span><span>{item.distance}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/20">
                  <h3 className="font-label-bold text-label-bold text-primary mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">flight</span> Connectivity
                  </h3>
                  <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                    {(connectivity.length > 0 ? connectivity : [
                      { title: 'International Airport', distance: '25 mins' },
                      { title: 'Hebbal Flyover', distance: '3 mins' }
                    ]).map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.title}</span><span>{item.distance}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </section>

            {/* Section 4 · Floor Plans */}
            <section>
              <div className="flex justify-between items-end mb-stack-md">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Structural Layout</h2>
                  <p className="font-body-md text-on-surface-variant text-sm mt-1">
                    Expected Possession: {property.possession}
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-8 rounded-xl premium-shadow border border-outline-variant/10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Master Site Layout</h3>
                  <button 
                    onClick={() => alert('PDF Brochure request initiated. Our team will email it to you shortly.')}
                    className="text-primary font-label-bold text-label-bold flex items-center gap-2 hover:underline bg-transparent border-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">download</span> Download PDF
                  </button>
                </div>
                <div className="h-80 bg-surface-container rounded-lg flex flex-col items-center justify-center border border-outline-variant/20 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <span className="material-symbols-outlined text-white text-4xl mb-2">lock</span>
                    <p className="text-white font-bold">Available upon request</p>
                  </div>
                  <img
                    alt="Floor Plan Site Layout Placeholder"
                    className="w-full h-full object-cover opacity-30 blur-[2px]"
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                  />
                  <div className="absolute font-display-lg text-primary/50 font-bold text-2xl z-0 tracking-widest uppercase">
                    Floor Plan Preview
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* ── RIGHT COLUMN · Sticky Sidebar ─────────────────── */}
          <div className="lg:col-span-4 relative">
            <div className="lg:sticky lg:top-[120px] bg-surface-container-lowest p-8 rounded-xl premium-shadow border border-outline-variant/10">

              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Book Site Visit</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Experience {property.title} with a guided tour from our senior advisors.
              </p>

              {visitSubmitted ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-[48px] text-green-600 mb-3 block"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2">Request Received!</h4>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    Our advisory team will contact you shortly to confirm your site visit.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVisitSubmit} className="space-y-4">
                  <div>
                    <label
                      className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2"
                      htmlFor="pd-name"
                    >
                      Full Name
                    </label>
                    <input
                      required
                      className="w-full bg-surface-bright border-b border-outline-variant/50 focus:border-primary-container focus:ring-0 px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-colors outline-none"
                      id="pd-name"
                      placeholder="Enter your name"
                      type="text"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2"
                        htmlFor="pd-phone"
                      >
                        Phone *
                      </label>
                      <input
                        required
                        className="w-full bg-surface-bright border-b border-outline-variant/50 focus:border-primary-container focus:ring-0 px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-colors outline-none"
                        id="pd-phone"
                        placeholder="Mobile number"
                        type="tel"
                      />
                    </div>
                    <div>
                      <label
                        className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2"
                        htmlFor="pd-email"
                      >
                        Email Address
                      </label>
                      <input
                        required
                        className="w-full bg-surface-bright border-b border-outline-variant/50 focus:border-primary-container focus:ring-0 px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-colors outline-none"
                        id="pd-email"
                        placeholder="Enter your email"
                        type="email"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2"
                      htmlFor="pd-message"
                    >
                      Inquiry Details
                    </label>
                    <textarea
                      required
                      className="w-full bg-surface-bright border border-outline-variant/50 rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container p-3 font-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-colors resize-none outline-none"
                      id="pd-message"
                      placeholder={`I am interested in ${property.title}...`}
                      rows={4}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-lg font-label-bold text-label-bold hover:bg-primary-container transition-colors shadow-sm mt-4 cursor-pointer border-none"
                  >
                    Request Callback & Site Visit
                  </button>
                </form>
              )}

              {/* MD Advisor card */}
              <div className="mt-8 pt-8 border-t border-outline-variant/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container overflow-hidden shrink-0">
                    <img
                      alt="Advisor Profile"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_SpDGhwG8h_o6mfRiwKNr8g_cz2MSn3V4Mv-2xL_S8WI3ikoU_3snw8Ikpbo4CZUnyBGwMl07TOF-A7gI4dAF4ZW_4WvhMGYRDiMHNVGkSJI-pw_6uuuqgOUxSzyWES75NXH_O1U4xbgCZ2F6PG5B0Uziay2r09TgyjtuTli-od-yL1Sf5dX5rJa60Jvm-yIikqbBpuZbYmOqct97soGIsGIQrwQ1IycDg9ZjH9-aNL91Wps4UNQSEyACmp-S9sA7-b2lPOscPaBz"
                    />
                  </div>
                  <div>
                    <p className="font-label-bold text-label-bold text-on-surface">Vivek Anand</p>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">Managing Director</p>
                  </div>
                </div>
              </div>

              {/* Inline EMI Widget */}
              <div className="mt-8 pt-8 border-t border-outline-variant/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-label-bold text-label-bold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">calculate</span> Estimated EMI
                  </h3>
                  <Link to="/home-loan" className="text-xs font-bold text-secondary uppercase hover:underline">Full Calc</Link>
                </div>
                <div className="bg-surface-bright p-4 rounded-lg border border-outline-variant/30">
                  <p className="text-2xl font-bold text-primary mb-1">{formatINR(emiAmount)} <span className="text-sm font-normal text-on-surface-variant">/ month</span></p>
                  <p className="text-xs text-on-surface-variant">Based on {formatINR(property.priceValue)} for {emiTenure} years @ {emiInterest}% p.a.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
