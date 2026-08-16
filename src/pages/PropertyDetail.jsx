import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperty } from '../hooks/useProperty';
import { useSEO } from '../hooks/useSEO';
import { submitLead } from '../lib/leads';
import { getPublishedProperties } from '../lib/properties';
import { parseVideoUrl } from '../utils/video';

// ─── Section IDs for sticky nav ────────────────────────────────────────────
const SECTIONS = [
  { id: 'sec-overview',   label: 'Overview',    icon: 'home' },
  { id: 'sec-pricing',    label: 'Price List',  icon: 'payments' },
  { id: 'sec-floorplans', label: 'Floor Plans', icon: 'architecture' },
  { id: 'sec-amenities',  label: 'Amenities',   icon: 'pool' },
  { id: 'sec-specifications', label: 'Specifications', icon: 'handyman' },
  { id: 'sec-location',   label: 'Location',    icon: 'location_on' },
  { id: 'sec-rera',       label: 'RERA',        icon: 'verified' },
  { id: 'sec-developer',  label: 'Developer',   icon: 'business_center' },
  { id: 'sec-similar',    label: 'Similar',     icon: 'apartment' },
];

export default function PropertyDetail({ 
  savedIds = [], 
  onToggleSave = () => {}, 
  onOpenVIPModal = () => {},
  customProperty = null,
  isPreview = false
}) {
  const { id } = useParams();
  const { property: fetchedProperty, loading: fetchLoading } = useProperty(customProperty ? null : id);
  const property = customProperty || fetchedProperty;
  const loading = customProperty ? false : fetchLoading;

  useSEO({
    title: property?.title,
    description: property?.description?.slice(0, 150) + '...',
    image: property?.images?.[0] || property?.heroImage,
    jsonLd: property ? {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": property.title,
      "image": property.images?.[0] || property.heroImage,
      "description": property.description,
      "offers": {
        "@type": "Offer",
        "price": property.priceRaw,
        "priceCurrency": "INR"
      }
    } : null
  });

  // ── Gallery state ────────────────────────────────────────────────────────
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [heroMode, setHeroMode] = useState('photos'); // 'photos' | 'video'
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Video parsing
  const videoInfo = parseVideoUrl(property?.walkthroughVideoUrl || property?.walkthrough_video_url);

  // ── Lead form state ──────────────────────────────────────────────────────
  const [visitSubmitted, setVisitSubmitted] = useState(false);
  const [brochureRequested, setBrochureRequested] = useState(false);

  // ── EMI state ────────────────────────────────────────────────────────────
  const [emiInterest] = useState(8.5);
  const [emiTenure] = useState(20);

  // ── Phase 1.1: Sticky nav state ──────────────────────────────────────────
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('sec-overview');
  const heroRef = useRef(null);
  const sectionRefs = useRef({});

  // ── Phase 1.2: Amenities expand state ────────────────────────────────────
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);
  const [expandedAmenityCategories, setExpandedAmenityCategories] = useState({});

  // ── Phase 1.3: Description expand state ──────────────────────────────────
  const [descExpanded, setDescExpanded] = useState(false);

  // ── Phase 1.5: Similar properties ────────────────────────────────────────
  const [similarProperties, setSimilarProperties] = useState([]);

  // ── Reset on property change ──────────────────────────────────────────────
  useEffect(() => {
    if (property) {
      setActiveImageIndex(0);
      setDescExpanded(false);
      setAmenitiesExpanded(false);

      // Fetch similar properties by micromarket
      if (property.micromarket) {
        getPublishedProperties({ micromarket: property.micromarket })
          .then((all) => {
            const others = all.filter(p => p.id !== property.id).slice(0, 6);
            setSimilarProperties(others);
          })
          .catch(() => setSimilarProperties([]));
      }
    }
  }, [property]);

  // ── Phase 1.1: Sticky nav scroll logic ───────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      setShowStickyNav(heroBottom < 0);

      // Determine active section
      let currentId = 'sec-overview';
      for (const { id: sid } of SECTIONS) {
        const el = sectionRefs.current[sid];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 130) currentId = sid;
        }
      }
      setActiveSectionId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    const el = sectionRefs.current[sectionId];
    if (el) {
      const offset = 110; // sticky nav height + buffer
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const setSectionRef = (id) => (el) => {
    sectionRefs.current[id] = el;
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
        <div className="flex flex-col lg:flex-row gap-4 mb-12">
          <div className="w-full lg:w-2/3 h-[400px] md:h-[600px] bg-slate-200 rounded-2xl"></div>
          <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-4">
            <div className="flex-1 h-32 md:h-[190px] bg-slate-200 rounded-2xl"></div>
            <div className="flex-1 h-32 md:h-[190px] bg-slate-200 rounded-2xl"></div>
            <div className="flex-1 h-32 md:h-[190px] bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
              <div className="h-16 bg-slate-200 rounded w-full"></div>
              <div className="h-16 bg-slate-200 rounded w-full"></div>
              <div className="h-16 bg-slate-200 rounded w-full"></div>
              <div className="h-16 bg-slate-200 rounded w-full"></div>
            </div>
          </div>
          <div className="h-[400px] bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // ── EMI calc ──────────────────────────────────────────────────────────────
  const priceVal = property.priceValue || 30000000;
  const loanPrincipal = Math.round(priceVal * 0.8);
  const r = emiInterest / 12 / 100;
  const n = emiTenure * 12;
  const emiAmount = Math.round(
    (loanPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  );
  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  const isSaved = savedIds.includes(property.id);

  // ── Lead submit ───────────────────────────────────────────────────────────
  const handleVisitSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements['pd-name']?.value || '';
    const phone = form.elements['pd-phone']?.value || '';
    const email = form.elements['pd-email']?.value || '';
    const message = form.elements['pd-message']?.value || '';
    try {
      await submitLead({
        name, phone, email,
        propertyTitle: property.title,
        leadType: form.elements['pd-intent']?.value || 'Property Inquiry',
        message
      });
      setVisitSubmitted(true);
    } catch (err) {
      console.error('Lead submission warning:', err);
    }
  };

  const handleNextImage = () => setActiveImageIndex((prev) => (prev + 1) % property.images.length);
  const handlePrevImage = () => setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);

  // ── Proximity category split ──────────────────────────────────────────────
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
  const connectivity = property.proximity.filter(p => !techParks.includes(p) && !healthcare.includes(p));

  // ── Amenity icon/subtitle ─────────────────────────────────────────────────
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
    if (n.includes('club')) return 'groups';
    if (n.includes('kids') || n.includes('play')) return 'child_care';
    if (n.includes('library') || n.includes('study')) return 'menu_book';
    if (n.includes('spa') || n.includes('sauna')) return 'spa';
    if (n.includes('basket') || n.includes('badminton')) return 'sports_basketball';
    if (n.includes('jogging') || n.includes('walking') || n.includes('trail')) return 'directions_run';
    return 'star';
  };
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
    if (n.includes('club')) return 'Premium clubhouse';
    if (n.includes('kids') || n.includes('play')) return "Dedicated children's area";
    if (n.includes('spa')) return 'Relaxation & rejuvenation';
    if (n.includes('jogging') || n.includes('trail')) return 'Serene outdoor path';
    return 'Premium amenity';
  };

  // ── Phase 1.4: Status bar color logic ────────────────────────────────────
  const statusColor = () => {
    const s = (property.status || '').toLowerCase();
    if (s.includes('new launch')) return 'from-violet-600 to-purple-700';
    if (s.includes('ready') || s.includes('move')) return 'from-emerald-600 to-green-700';
    if (s.includes('under') || s.includes('construction')) return 'from-amber-500 to-orange-600';
    return 'from-primary to-primary-container';
  };

  // ── All amenity items flattened for count ─────────────────────────────────
  const allAmenityItems = property.amenities.flatMap(cat => cat.list);
  const totalAmenities = allAmenityItems.length;

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased pb-24">

      {/* ── Phase 1.1: Sticky Section Nav ──────────────────────────────── */}
      <div
        className="no-print"
        style={{
          position: 'fixed',
          top: showStickyNav ? (isPreview ? '52px' : '72px') : '-100px',
          left: 0,
          right: 0,
          zIndex: 40,
          transition: 'top 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-2">
            {SECTIONS.map(({ id: sid, label, icon }) => (
              <button
                key={sid}
                type="button"
                onClick={() => scrollToSection(sid)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 border-none cursor-pointer ${
                  activeSectionId === sid
                    ? 'bg-slate-900 text-amber-300 shadow-sm'
                    : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
            {/* Quick CTA in nav */}
            <div className="ml-auto shrink-0 pl-2">
              <button
                type="button"
                onClick={() => onOpenVIPModal && onOpenVIPModal(`Inquiry: ${property.title}`)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border-none cursor-pointer transition-colors shadow-sm"
              >
                Get Best Price
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Breadcrumb Bar ──────────────────────────────────────────── */}
      <div className={`w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 no-print ${isPreview ? 'pt-3 pb-3' : 'pt-20 pb-3'}`}>
        <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="flex items-center font-label-sm text-label-sm text-on-surface-variant">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2 text-slate-400">/</span>
            <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-on-surface font-label-bold truncate max-w-[200px] sm:max-w-md">{property.title}</span>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-slate-200"
          >
            <span className="material-symbols-outlined text-[16px]">print</span> Print
          </button>
        </div>
      </div>

      <main className="pt-stack-lg pb-section-gap">

        {/* ── Gallery Section ──────────────────────────────────────────── */}
        <section ref={heroRef} className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-stack-lg">

          <div
            className="relative h-[300px] sm:h-[450px] md:h-[600px] lg:h-[716px] rounded-xl overflow-hidden image-border-protect group"
          >
            {heroMode === 'video' && videoInfo ? (
              <div className="w-full h-full bg-black relative">
                {videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' || videoInfo.type === 'custom' ? (
                  <iframe
                    src={videoInfo.embedUrl}
                    title={`${property.title} Video Tour`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={videoInfo.embedUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    poster={property.heroImage}
                  />
                )}
                {/* Top overlay controls in video mode */}
                <div className="absolute top-stack-md left-stack-md flex items-center gap-2 z-20">
                  <button
                    type="button"
                    onClick={() => setHeroMode('photos')}
                    className="bg-black/70 hover:bg-black/90 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 transition-all border border-white/20 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">photo_library</span>
                    <span>View Photos ({property.images?.length || 1})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(true)}
                    className="bg-black/70 hover:bg-black/90 text-white backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 transition-all border border-white/20 cursor-pointer"
                    title="Fullscreen"
                  >
                    <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="w-full h-full relative cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={property.images ? property.images[activeImageIndex] : property.heroImage}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-stack-md left-stack-md flex items-center gap-2">
                  <div className="bg-surface/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">photo_library</span>
                    {activeImageIndex + 1} / {property.images?.length || 1}
                  </div>
                  {videoInfo && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setHeroMode('video'); }}
                      className="bg-surface/70 hover:bg-surface/95 text-on-surface backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all border border-surface/30 cursor-pointer"
                      title="Play Video Walkthrough"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                      <span>Play Video Tour</span>
                    </button>
                  )}
                </div>

                <div className="absolute top-stack-md right-stack-md">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onToggleSave(property); }}
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
                    <button type="button" onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} className="glass-panel p-3 rounded-full hover:bg-surface/90 transition-colors group/btn">
                      <span className="material-symbols-outlined text-primary group-hover/btn:scale-110 transition-transform">chevron_left</span>
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleNextImage(); }} className="glass-panel p-3 rounded-full hover:bg-surface/90 transition-colors group/btn">
                      <span className="material-symbols-outlined text-primary group-hover/btn:scale-110 transition-transform">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-3 mt-4 overflow-x-auto hide-scrollbar pb-2">
            {property.images && property.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { setHeroMode('photos'); setActiveImageIndex(idx); }}
                className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  heroMode === 'photos' && activeImageIndex === idx ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}

            {/* Video tour button thumbnail */}
            {videoInfo && (
              <button
                type="button"
                onClick={() => setHeroMode('video')}
                className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer group shadow-sm ${
                  heroMode === 'video' ? 'border-primary opacity-100 ring-2 ring-primary/20' : 'border-outline-variant/30 opacity-70 hover:opacity-100'
                }`}
              >
                {videoInfo.thumbnailUrl ? (
                  <img src={videoInfo.thumbnailUrl} alt="Video preview" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                ) : null}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
                  <span className="material-symbols-outlined text-amber-300 text-2xl group-hover:scale-110 transition-transform">play_circle</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white">Video Tour</span>
                </div>
              </button>
            )}
          </div>

          {/* Lightbox */}
          {isLightboxOpen && (
            <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-xl">
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2 rounded-full cursor-pointer transition-colors border-none"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : (property.images?.length || 1) - 1)); }} className="absolute left-6 text-white/70 hover:text-white bg-white/10 p-3 rounded-full cursor-pointer transition-colors border-none">
                <span className="material-symbols-outlined text-3xl">chevron_left</span>
              </button>
              <img src={property.images ? property.images[activeImageIndex] : property.heroImage} alt="Fullscreen" className="max-w-[90vw] max-h-[90vh] object-contain select-none" />
              <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev < (property.images?.length || 1) - 1 ? prev + 1 : 0)); }} className="absolute right-6 text-white/70 hover:text-white bg-white/10 p-3 rounded-full cursor-pointer transition-colors border-none">
                <span className="material-symbols-outlined text-3xl">chevron_right</span>
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-bold tracking-widest text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                {activeImageIndex + 1} / {property.images?.length || 1}
              </div>
            </div>
          )}

          {/* Dedicated Video Modal */}
          {isVideoModalOpen && videoInfo && (
            <div 
              className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
              onClick={() => setIsVideoModalOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full cursor-pointer transition-colors border-none z-10 flex items-center justify-center"
                title="Close video"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
              <div 
                className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/20 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' || videoInfo.type === 'custom' ? (
                  <iframe
                    src={videoInfo.embedUrl}
                    title={`${property.title} Video Tour`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={videoInfo.embedUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                    poster={property.heroImage}
                  />
                )}
              </div>
            </div>
          )}
        </section>

        {/* ── Phase 1.4: Status Hero Bar ──────────────────────────────── */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-stack-lg">
          <div className={`bg-gradient-to-r ${statusColor()} rounded-xl px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-3 shadow-lg`}>

            {property.status && (
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-[18px]">circle</span>
                <span className="font-bold text-sm uppercase tracking-wider">{property.status}</span>
              </div>
            )}

            {property.bhkOptions?.length > 0 && (
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <span className="material-symbols-outlined text-[16px]">apartment</span>
                <span>{property.bhkOptions.join(' · ')}</span>
              </div>
            )}

            {property.startingPrice && (
              <div className="flex items-center gap-2 text-white text-sm">
                <span className="material-symbols-outlined text-[16px]">payments</span>
                <span className="font-bold">Starting {property.startingPrice}</span>
              </div>
            )}

            {property.reraId && (
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold border border-white/25">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                RERA: {property.reraId}
              </div>
            )}

            {property.possession && (
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <span className="material-symbols-outlined text-[16px]">event</span>
                <span>Possession: {property.possession}</span>
              </div>
            )}

            {property.buyerPersonas && property.buyerPersonas.length > 0 && (
              <div className="flex items-center gap-2">
                {property.buyerPersonas.map((persona, idx) => (
                  <span key={idx} className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-white/30">
                    {persona}
                  </span>
                ))}
              </div>
            )}

            <div className="ml-auto">
              <a
                href={`https://wa.me/?text=Check out this premium property: ${property.title} in ${property.location}. View on QuestSpaces!`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors px-3 py-1.5 rounded-full text-white text-xs font-bold border border-white/25 no-underline"
              >
                <span className="material-symbols-outlined text-[14px]">share</span>
                Share
              </a>
            </div>
          </div>
        </div>

        {/* ── Main Content + Sidebar grid ─────────────────────────────── */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter">

          {/* ── LEFT COLUMN ──────────────────────────────────────────── */}
          <div className="lg:col-span-8 flex flex-col gap-section-gap">

            {/* Section 1 · Header & Overview */}
            <section id="sec-overview" ref={setSectionRef('sec-overview')}>
              <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface mb-4">
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-body-lg text-body-lg mb-8">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">location_on</span>
                  <span>{property.location}</span>
                </div>
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

              {/* Phase 1.3: Read More / Less Description */}
              <div className="prose max-w-none text-on-surface-variant font-body-lg text-body-lg">
                <div
                  style={{
                    maxHeight: descExpanded ? '10000px' : '9rem',
                    overflow: 'hidden',
                    transition: 'max-height 0.5s ease',
                  }}
                >
                  <p style={{ marginBottom: '1.25rem' }}>{property.description}</p>
                  {property.longDescription && (
                    <p>{property.longDescription}</p>
                  )}
                </div>
                {((property.description?.length || 0) + (property.longDescription?.length || 0)) > 300 && (
                  <button
                    onClick={() => setDescExpanded(v => !v)}
                    className="mt-3 flex items-center gap-1 text-primary font-bold text-sm bg-transparent border-none cursor-pointer hover:underline transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {descExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                    {descExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>

              {/* Recent Updates Timeline */}
              {property.recentUpdates && property.recentUpdates.length > 0 && (
                <div className="mt-8 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 premium-shadow">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">update</span> Project Updates
                  </h3>
                  <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-outline-variant/30 pl-2">
                    {property.recentUpdates.map((upd, idx) => (
                      <div key={idx} className="relative pl-8">
                        <div className="absolute left-0 top-1 w-6 h-6 bg-primary/10 rounded-full border-2 border-surface-container-lowest flex items-center justify-center -translate-x-[2px]">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/10">
                          <div className="flex justify-between flex-wrap gap-2 mb-1">
                            <h4 className="font-bold text-on-surface text-sm">{upd.title}</h4>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{upd.date}</span>
                          </div>
                          {upd.description && <p className="text-sm text-on-surface-variant mt-1">{upd.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Section 2: Price List */}
            <section id="sec-pricing" ref={setSectionRef('sec-pricing')}>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">
                Price List
              </h2>
              {property.pricingMatrix && property.pricingMatrix.length > 0 ? (
                <div className="rounded-xl overflow-hidden border border-outline-variant/20 premium-shadow">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--color-surface-container-low)' }}>
                        <th className="text-left px-5 py-3 font-bold text-on-surface text-xs uppercase tracking-wider">Unit Type</th>
                        <th className="text-left px-5 py-3 font-bold text-on-surface text-xs uppercase tracking-wider hidden sm:table-cell">Carpet Area</th>
                        <th className="text-left px-5 py-3 font-bold text-on-surface text-xs uppercase tracking-wider hidden md:table-cell">Built-up</th>
                        <th className="text-left px-5 py-3 font-bold text-on-surface text-xs uppercase tracking-wider">Price</th>
                        <th className="text-left px-5 py-3 font-bold text-on-surface text-xs uppercase tracking-wider hidden sm:table-cell">Status</th>
                        <th className="px-5 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.pricingMatrix.map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-t border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors"
                        >
                          <td className="px-5 py-4 font-bold text-on-surface">{row.config}</td>
                          <td className="px-5 py-4 text-on-surface-variant hidden sm:table-cell">{row.carpetArea}</td>
                          <td className="px-5 py-4 text-on-surface-variant hidden md:table-cell">{row.superArea}</td>
                          <td className="px-5 py-4 font-bold text-primary">{row.price}</td>
                          <td className="px-5 py-4 hidden sm:table-cell">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              row.availability === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                              row.availability === 'Sold Out' ? 'bg-red-100 text-red-700' :
                              row.availability === 'Limited Units' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {row.availability || 'Available'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => onOpenVIPModal && onOpenVIPModal(`Payment Plan: ${row.config} — ${property.title}`)}
                              className="text-primary font-bold text-xs hover:underline bg-transparent border-none cursor-pointer whitespace-nowrap"
                            >
                              Get Plan →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-5 py-3 bg-surface-container-low/50 border-t border-outline-variant/20">
                    <p className="text-[11px] text-on-surface-variant">
                      * Prices are indicative and subject to change. Contact us for the current payment plan and availability.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container-low rounded-xl p-8 text-center border border-outline-variant/20">
                  <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40 mb-3 block">payments</span>
                  <p className="text-on-surface-variant text-sm">Price details available on request.</p>
                  <button
                    onClick={() => onOpenVIPModal && onOpenVIPModal(`Price List: ${property.title}`)}
                    className="mt-4 px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold border-none cursor-pointer hover:bg-primary-container transition-colors"
                  >
                    Request Price Details
                  </button>
                </div>
              )}

              {/* Price Insights */}
              {property.priceInsights && property.priceInsights.length > 0 && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {property.priceInsights.map((insight, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex flex-col justify-between">
                      <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-2">{insight.label}</p>
                      <div className="flex items-end justify-between">
                        <p className="text-lg font-bold text-on-surface">{insight.value}</p>
                        {insight.trend && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-0.5 ${insight.trend.startsWith('-') ? 'text-red-700 bg-red-100' : 'text-emerald-700 bg-emerald-100'}`}>
                            <span className="material-symbols-outlined text-[14px]">
                              {insight.trend.startsWith('-') ? 'trending_down' : 'trending_up'}
                            </span>
                            {insight.trend}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Section 3 · Floor Plans & Downloads */}
            <section id="sec-floorplans" ref={setSectionRef('sec-floorplans')} className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-stack-md">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">Floor Plans</h2>
                    <p className="font-body-md text-on-surface-variant text-sm mt-1">
                      Explore detailed layouts for each configuration.
                    </p>
                  </div>
                </div>
                
                <div className="bg-surface-container-lowest p-8 rounded-xl premium-shadow border border-outline-variant/10">
                  {property.pricingMatrix && property.pricingMatrix.filter(r => r.floorPlanImage).length > 0 ? (
                    <div>
                      {/* We could use state for active tab, but for simplicity let's just show them stacked or in a grid, or we use a quick local state trick if needed. We'll map them vertically as cards. */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {property.pricingMatrix.filter(r => r.floorPlanImage).map((row, idx) => (
                          <div key={idx} className="border border-outline-variant/20 rounded-lg overflow-hidden group">
                            <div className="p-4 bg-surface-container-low border-b border-outline-variant/20 flex justify-between items-center">
                              <div>
                                <h4 className="font-bold text-on-surface">{row.config}</h4>
                                <p className="text-xs text-on-surface-variant">{row.superArea} Built-up</p>
                              </div>
                              <button 
                                onClick={() => onOpenVIPModal && onOpenVIPModal(`Floor Plan: ${row.config} — ${property.title}`)}
                                className="text-primary text-xs font-bold bg-primary/10 px-3 py-1.5 rounded-full border-none cursor-pointer hover:bg-primary/20 transition-colors"
                              >
                                View Pricing
                              </button>
                            </div>
                            <div className="h-64 relative bg-surface-container cursor-pointer overflow-hidden" onClick={() => onOpenVIPModal && onOpenVIPModal(`Download Floor Plan: ${row.config} — ${property.title}`)}>
                              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <span className="material-symbols-outlined text-white text-3xl mb-2">download</span>
                                <p className="text-white font-bold text-sm">Request High-Res Plan</p>
                              </div>
                              <img src={row.floorPlanImage} alt={`${row.config} layout`} className="w-full h-full object-cover blur-[1px] opacity-70 group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-surface-container rounded-lg flex flex-col items-center justify-center border border-outline-variant/20 relative group">
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <span className="material-symbols-outlined text-white text-4xl mb-2">lock</span>
                        <p className="text-white font-bold">Available upon request</p>
                        <button 
                          onClick={() => onOpenVIPModal && onOpenVIPModal(`Brochure & Floor Plan: ${property.title}`)}
                          className="mt-3 px-4 py-2 bg-white text-primary text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm border-none cursor-pointer hover:bg-gray-100"
                        >
                          Unlock Floor Plans
                        </button>
                      </div>
                      <img
                        alt="Floor Plan Site Layout Placeholder"
                        className="w-full h-full object-cover opacity-30 blur-[2px]"
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                      />
                      <div className="absolute font-display-lg text-primary/50 font-bold text-xl z-0 tracking-widest uppercase">
                        Layouts on Request
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Downloads Hub */}
              {(property.brochureUrl || property.masterPlanImageUrl || property.walkthroughVideoUrl) && (
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 p-6 rounded-xl border border-blue-100 premium-shadow">
                  <h3 className="font-headline-sm text-headline-sm text-slate-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">download_for_offline</span> Project Downloads Hub
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {property.brochureUrl && (
                      <button onClick={() => onOpenVIPModal && onOpenVIPModal(`Download Brochure: ${property.title}`)} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-primary hover:shadow-md transition-all cursor-pointer text-left group">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                          <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors">E-Brochure</p>
                          <p className="text-[10px] text-slate-500">Complete Details</p>
                        </div>
                      </button>
                    )}
                    {property.masterPlanImageUrl && (
                      <button onClick={() => onOpenVIPModal && onOpenVIPModal(`Master Plan: ${property.title}`)} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-primary hover:shadow-md transition-all cursor-pointer text-left group">
                        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                          <span className="material-symbols-outlined text-emerald-500">map</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors">Master Plan</p>
                          <p className="text-[10px] text-slate-500">Site Layout</p>
                        </div>
                      </button>
                    )}
                    {property.walkthroughVideoUrl && (
                      <button 
                        type="button"
                        onClick={() => {
                          if (videoInfo) {
                            setIsVideoModalOpen(true);
                          } else {
                            window.open(property.walkthroughVideoUrl, '_blank', 'noopener,noreferrer');
                          }
                        }} 
                        className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-primary hover:shadow-md transition-all cursor-pointer text-left group"
                      >
                        <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                          <span className="material-symbols-outlined text-purple-500">play_circle</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors">Video Tour</p>
                          <p className="text-[10px] text-slate-500">Watch Walkthrough</p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Video Walkthrough Experience Section */}
              {videoInfo && (
                <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant/20 premium-shadow space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-primary font-label-bold text-xs uppercase tracking-widest mb-1">
                        <span className="material-symbols-outlined text-[16px]">videocam</span> Architecture & Space
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Virtual Walkthrough</h3>
                      <p className="font-body-md text-on-surface-variant text-sm mt-1">
                        Take an interactive cinematic tour of {property.title} and its curated residences.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => onOpenVIPModal && onOpenVIPModal(`Guided Virtual Tour: ${property.title}`)}
                        className="px-4 py-2 bg-primary hover:bg-primary-container text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border-none cursor-pointer shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">person_pin_circle</span> Request Live Guided Tour
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsVideoModalOpen(true)}
                        className="px-3.5 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-outline-variant/30 cursor-pointer shadow-sm"
                        title="Fullscreen Player"
                      >
                        <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                      </button>
                    </div>
                  </div>

                  {/* Frame */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-container border border-outline-variant/20 shadow-md">
                    {videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' || videoInfo.type === 'custom' ? (
                      <iframe
                        src={videoInfo.embedUrl}
                        title={`${property.title} Video Walkthrough`}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={videoInfo.embedUrl}
                        controls
                        className="w-full h-full object-cover"
                        poster={property.heroImage}
                      />
                    )}
                  </div>

                  {/* Highlights Bar below player */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-outline-variant/10 text-xs text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">hd</span>
                      <span className="font-semibold text-on-surface">4K Ultra-HD Walkthrough</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">volume_up</span>
                      <span className="font-semibold text-on-surface">Ambient Spatial Audio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">domain</span>
                      <span className="font-semibold text-on-surface">Architectural & Model Tour</span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Section 4 · Phase 1.2: Full Amenities Accordion */}
            <section id="sec-amenities" ref={setSectionRef('sec-amenities')}>
              <div className="flex justify-between items-center mb-stack-md">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    World-Class Amenities
                  </h2>
                  <p className="text-sm text-on-surface-variant mt-1">
                    {totalAmenities} amenities across {property.amenities.length} categories
                  </p>
                </div>
              </div>

              {property.amenities.length > 0 ? (
                <div className="space-y-3">
                  {property.amenities.map((cat, catIdx) => {
                    const isCatExpanded = expandedAmenityCategories[catIdx] !== false; // default open
                    return (
                      <div
                        key={catIdx}
                        className="rounded-xl border border-outline-variant/20 overflow-hidden premium-shadow"
                        style={{ background: 'var(--color-surface-container-lowest)' }}
                      >
                        {/* Category header */}
                        <button
                          onClick={() => setExpandedAmenityCategories(prev => ({
                            ...prev,
                            [catIdx]: !isCatExpanded
                          }))}
                          className="w-full flex items-center justify-between px-6 py-4 cursor-pointer border-none text-left transition-colors hover:bg-surface-container-low/50"
                          style={{ background: 'transparent' }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-[22px]">
                              {catIdx === 0 ? 'fitness_center' :
                               catIdx === 1 ? 'sports_volleyball' :
                               catIdx === 2 ? 'pool' :
                               catIdx === 3 ? 'groups' :
                               catIdx === 4 ? 'nature_people' : 'star'}
                            </span>
                            <h3 className="font-bold text-on-surface text-sm">{cat.category}</h3>
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                              {cat.list?.length || 0}
                            </span>
                          </div>
                          <span className="material-symbols-outlined text-on-surface-variant text-[20px] transition-transform" style={{ transform: isCatExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            expand_more
                          </span>
                        </button>

                        {/* Category items */}
                        {isCatExpanded && (
                          <div className="px-6 pb-5 grid grid-cols-2 md:grid-cols-3 gap-3 border-t border-outline-variant/10">
                            {(cat.list || []).map((amenity, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 py-2"
                              >
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0"
                                  style={{ fontVariationSettings: "'FILL' 1" }}>
                                  {getIcon(amenity)}
                                </span>
                                <div className="min-w-0">
                                  <p className="font-semibold text-on-surface text-xs leading-tight">{amenity}</p>
                                  <p className="text-on-surface-variant text-[10px] leading-tight mt-0.5">{getSubtitle(amenity)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-on-surface-variant text-sm">Amenity details not available.</p>
              )}
            </section>

            {/* Section 4.5 · Specifications */}
            {property.specifications && property.specifications.length > 0 && (
              <section id="sec-specifications" ref={setSectionRef('sec-specifications')}>
                <div className="flex justify-between items-center mb-stack-md">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">
                      Project Specifications
                    </h2>
                    <p className="text-sm text-on-surface-variant mt-1">
                      Detailed material and finishing details.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.specifications.map((spec, catIdx) => (
                    <div key={catIdx} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 premium-shadow">
                      <h3 className="font-bold text-primary flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
                        <span className="material-symbols-outlined text-lg">check_circle</span> {spec.category}
                      </h3>
                      <ul className="space-y-3">
                        {spec.items && spec.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex justify-between items-start gap-4 text-sm">
                            <span className="text-on-surface-variant shrink-0">{item.name}</span>
                            <span className="text-on-surface font-semibold text-right">{item.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 5 · Location Advantages */}
            <section id="sec-location" ref={setSectionRef('sec-location')}>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">
                Strategic Location Advantage
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {techParks.length > 0 && (
                  <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/20">
                    <h3 className="font-label-bold text-label-bold text-primary mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">business</span> Tech & Business Hubs
                    </h3>
                    <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                      {techParks.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.title}</span><span className="font-semibold text-primary">{item.distance}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {healthcare.length > 0 && (
                  <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/20">
                    <h3 className="font-label-bold text-label-bold text-primary mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">medical_services</span> Healthcare & Wellness
                    </h3>
                    <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                      {healthcare.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.title}</span><span className="font-semibold text-primary">{item.distance}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {connectivity.length > 0 && (
                  <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/20">
                    <h3 className="font-label-bold text-label-bold text-primary mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">flight</span> Transit & Connectivity
                    </h3>
                    <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                      {connectivity.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.title}</span><span className="font-semibold text-primary">{item.distance}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* Section 6 · RERA Info */}
            {property.reraId && (
              <section id="sec-rera" ref={setSectionRef('sec-rera')}>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">
                  RERA Details
                </h2>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-emerald-600 text-[24px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">RERA Registration Number</p>
                      <p className="font-bold text-on-surface text-lg font-mono">{property.reraId}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {[
                      { icon: 'schedule', title: 'Delivery Commitment', desc: 'RERA-bound possession date protects your timeline' },
                      { icon: 'savings', title: 'Escrow Protection', desc: '70% of collections held in project-specific escrow' },
                      { icon: 'gavel', title: 'Specification Lock', desc: 'Builder cannot alter specs without buyer consent' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5 shrink-0">{item.icon}</span>
                        <div>
                          <p className="font-bold text-on-surface text-xs">{item.title}</p>
                          <p className="text-on-surface-variant text-[11px] mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {property.reraPortalUrl && (
                  <div className="mt-4 text-center">
                    <a href={property.reraPortalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors no-underline">
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span> Verify on RERA Portal
                    </a>
                  </div>
                )}
              </section>
            )}

            {/* Section 7 · Developer Profile */}
            {(property.developer || property.developerDescription) && (
              <section id="sec-developer" ref={setSectionRef('sec-developer')}>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">
                  About the Builder
                </h2>
                <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/20 premium-shadow">
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center border-b border-outline-variant/20 pb-6 mb-6">
                    {property.developerLogoUrl ? (
                      <div className="w-24 h-24 bg-white border border-outline-variant/30 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 shadow-sm">
                        <img src={property.developerLogoUrl} alt={property.developer} className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-surface-container rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-on-surface-variant text-3xl">business</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{property.developer}</h3>
                      <div className="flex flex-wrap gap-3">
                        {property.developerExperience && (
                          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-bold">
                            <span className="material-symbols-outlined text-[14px]">military_tech</span> {property.developerExperience}
                          </span>
                        )}
                        {property.developerProjectsCount && (
                          <span className="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-md text-xs font-bold">
                            <span className="material-symbols-outlined text-[14px]">domain</span> {property.developerProjectsCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="prose max-w-none text-on-surface-variant text-sm md:text-base leading-relaxed">
                    <p>{property.developerDescription || `${property.developer} is a leading real estate developer known for quality construction and timely delivery in the ${property.micromarketLabel || 'region'} area.`}</p>
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* ── RIGHT COLUMN · Sticky Sidebar ──────────────────────── */}
          <div className="lg:col-span-4 relative">
            <div className="lg:sticky lg:top-[120px] bg-surface-container-lowest p-8 rounded-xl premium-shadow border border-outline-variant/10">

              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">I'm Interested</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Request a brochure, book a site visit, or speak to an advisor about {property.title}.
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
                    <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="pd-intent">
                      I would like to *
                    </label>
                    <select
                      required
                      id="pd-intent"
                      className="w-full bg-surface-bright border-b border-outline-variant/50 focus:border-primary-container focus:ring-0 px-0 py-2 font-body-md text-on-surface transition-colors outline-none cursor-pointer"
                    >
                      <option value="Site Visit Request">Book a Site Visit</option>
                      <option value="Brochure Request">Request E-Brochure & Plans</option>
                      <option value="Callback Request">Request a Callback</option>
                      <option value="General Inquiry">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="pd-name">
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
                      <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="pd-phone">
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
                      <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="pd-email">
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
                    <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="pd-message">
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
                    Submit Inquiry
                  </button>

                  {/* WhatsApp CTA */}
                  <a
                    href={`https://wa.me/?text=Hi! I'm interested in ${property.title} at ${property.location}. Please share more details.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] font-bold text-sm py-3 rounded-lg hover:bg-[#25D366]/10 transition-colors no-underline"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
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
                  <p className="text-xs text-on-surface-variant">Based on 80% financing ({formatINR(loanPrincipal)}) for {emiTenure} years @ {emiInterest}% p.a.</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ── Phase 1.5: Similar Properties ──────────────────────────── */}
        {similarProperties.length > 0 && (
          <div id="sec-similar" ref={setSectionRef('sec-similar')} className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-section-gap">
            <div className="flex justify-between items-center mb-stack-md">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Similar Properties</h2>
                <p className="text-sm text-on-surface-variant mt-1">Explore more properties in {property.micromarketLabel || property.micromarket}</p>
              </div>
              <Link to="/properties" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
            <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-4">
              {similarProperties.map((p) => {
                const thumb = p.cover_image_url || (p.property_media?.[0]?.public_url) || '';
                const price = p.starting_price || '';
                return (
                  <Link
                    key={p.id}
                    to={`/properties/${p.slug}`}
                    className="shrink-0 w-64 rounded-xl overflow-hidden border border-outline-variant/20 premium-shadow bg-surface-container-lowest hover:shadow-xl transition-all hover:-translate-y-1 no-underline group"
                  >
                    <div className="h-40 bg-surface-container overflow-hidden">
                      {thumb ? (
                        <img src={thumb} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant/30 text-[48px]">apartment</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-on-surface text-sm leading-tight mb-1 line-clamp-1">{p.title}</p>
                      <p className="text-on-surface-variant text-xs flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                        {p.location}
                      </p>
                      {p.status && (
                        <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full mb-2">
                          {p.status}
                        </span>
                      )}
                      {price && (
                        <p className="font-bold text-primary text-sm">{price.startsWith('₹') ? price : `₹${price}`}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
