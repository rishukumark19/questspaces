import React from 'react';
import { Link } from 'react-router-dom';

const INSIGHT_ARTICLES = [
  {
    id: 'bengaluru-appreciation-outlook-2026',
    title: 'North Bengaluru Real Estate Outlook: Capital Appreciation Trends & Infrastructure Catalysts',
    category: 'Market Analysis',
    readTime: '6 min read',
    date: 'February 2026',
    summary: 'An empirical breakdown of capital appreciation across Hebbal, Yelahanka, and Devanahalli, driven by the Airport Metro Line and KIADB Aerospace Park.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    author: 'Vivek Anand, Principal Strategist',
    keyPoints: [
      'Hebbal prime residential corridor recorded 14.2% YoY growth in luxury segment.',
      'Devanahalli plotted and villa developments outperforming apartments in ROI multiples.',
      'Upcoming Blue Metro Line (KR Puram - Airport) accelerating corporate office relocations.'
    ]
  },
  {
    id: 'nri-investment-guide-bangalore',
    title: 'The NRI Property Investment Playbook: Compliance, Remittance & High-Yield Assets',
    category: 'Investment Advisory',
    readTime: '8 min read',
    date: 'January 2026',
    summary: 'Essential legal, tax (TDS under Section 195), and repatriable investment strategies for Non-Resident Indians acquiring luxury assets in Karnataka.',
    image: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?q=80&w=800&auto=format&fit=crop',
    author: 'Quest Spaces Advisory Desk',
    keyPoints: [
      'NRE vs NRO account transactions & repatriation norms under FEMA guidelines.',
      'Power of Attorney (PoA) execution without traveling to India.',
      'Rental yield arbitrage in Tech Park corridors like Manyata & Bagmane.'
    ]
  },
  {
    id: 'rera-compliance-due-diligence',
    title: 'K-RERA Due Diligence: 7 Non-Negotiable Checks Before Booking Pre-Launch Properties',
    category: 'Legal & Compliance',
    readTime: '5 min read',
    date: 'December 2025',
    summary: 'How to verify title deeds, encumbrance certificates, layout sanction approvals, and escrow account compliance under Karnataka RERA regulations.',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop',
    author: 'Legal Counsel, Quest Spaces',
    keyPoints: [
      'Verifying the 70% escrow allocation on the official K-RERA portal.',
      'Carpet area calculation versus super built-up loading factors.',
      'Penal interest entitlements for delayed possession clauses.'
    ]
  }
];

export default function Insights({ onOpenVIPModal }) {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased">
      
      {/* Hero Header */}
      <section className="bg-surface-container-lowest py-16 border-b border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center max-w-3xl">
          <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block mb-3">Research & Intelligence</span>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4">
            Bengaluru Property Market Insights
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Data-backed market reports, corridor growth analyses, and strategic advisories curated by Quest Spaces senior research analysts.
          </p>
        </div>
      </section>

      {/* Featured Articles Grid */}
      <section className="py-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-16">
          {INSIGHT_ARTICLES.map((article) => (
            <article 
              key={article.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-md shadow-md">
                    {article.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium mb-3">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h2 className="font-headline-sm text-lg font-bold text-primary mb-3 leading-snug group-hover:text-secondary transition-colors">
                    {article.title}
                  </h2>

                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                    {article.summary}
                  </p>

                  <div className="space-y-2 mb-6 bg-surface-container-low p-4 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-secondary tracking-widest block mb-1">Key Takeaways</span>
                    {article.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-on-surface">
                        <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">check_circle</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-outline-variant/20 mt-auto flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-semibold">{article.author}</span>
                <button 
                  onClick={() => onOpenVIPModal(`Advisory Session: ${article.title}`)}
                  className="text-primary font-bold text-xs uppercase tracking-wider hover:text-secondary flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Consult Analyst ↗
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Advisory Consultation Callout */}
        <div className="bg-primary text-white p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-2xl">
            <span className="text-gold text-xs uppercase tracking-widest font-bold block mb-2">Bespoke Research Desk</span>
            <h3 className="font-headline-lg text-2xl md:text-3xl font-bold mb-3 text-white">
              Need a Custom Portfolio Valuation or Market Feasibility Study?
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Our advisory team prepares institutional-grade micro-market investment briefs for HNWIs, NRIs, and institutional investors evaluating Bengaluru assets.
            </p>
          </div>
          <button 
            onClick={() => onOpenVIPModal('Custom Market Feasibility Request')}
            className="bg-gold text-primary font-bold px-8 py-3.5 rounded-lg text-xs uppercase tracking-widest hover:bg-gold-dark transition-all shrink-0 cursor-pointer border-none shadow-md"
          >
            Request Private Brief
          </button>
        </div>
      </section>

    </div>
  );
}
