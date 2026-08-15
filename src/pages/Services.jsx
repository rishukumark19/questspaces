import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TESTIMONIALS = [
  {
    quote: "From our first meeting, we knew we were in good hands. Quest Spaces' dedication to understanding our needs and finding the perfect home in Bengaluru was evident every step of the way.",
    name: "Ali Bin Saleh",
    role: "Real Estate Investor",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-nwSX3TCgA0zTHQ-SD8XKMorTKANdqBip1Nj1duYXcrdpse__IgWkJMPViVjJFUzHQhIcvfjaYfsQz7GnGSGLSXCHRjfRYPRisTeyWBO1tGJqB__8ZFAkcuiqgfiidYIywr8Nwci3MYzDRXWeJpp5gjyDFsDDAZAX_cWKpGW1LyBPCxNxyZC1gyHtJ2zmMzkh_8pZ2YROJcShK2KEBGxfv2hnzufQU7sHLO2bpKcKCMoK8LwUC-zgmusvXyZcfsYgjzncvoi3VAKc"
  },
  {
    quote: "Quest Spaces' deep micro-market intelligence was invaluable for our portfolio diversification in North Bengaluru. Their transparent guidance saved us time and capital.",
    name: "Vikram & Ananya Sengupta",
    role: "NRI Tech Investors",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8fxZFpDWvdp-GIzlQXWU11J9g7ROACX3IEQVbeJcTpt05OOjxPwHq4oAUtmozNQM1zaPpEQ-n6znLar-kfo-2jIfDE7BbKZ1mQ5dWd4QmONVsp2uddwV1WiRX9quLU8I-jMlk988a3O3Wp72EnT9wT_8g2bnF6jzXAOkshietCheOYFQp-DbBjw7FctOnfLulE-ItwlFSBqJSVNd7pafzx-qN2jQnh8FaE2e8hat916cLoEr71Xh9NAN0VqJz36nWzyFUIM3cQJ3R"
  },
  {
    quote: "Quest Spaces made the home loan and paperwork process absolutely seamless. We couldn't be happier with our new home in Bengaluru.",
    name: "Michael & Sarah",
    role: "Homeowners",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtZAiy3mUVtNO9awyqZ2X4QFd4yxQH8dTf7hcZ1tFjovQttfRzqcyNUWbHtskVMP2GsJ5z-GWWXFtzFdM5DzLtJpkuSTGMD74dsJ3zIXQPjlvpvpyQQ1NxrTqviRnK9_MMS1NtyQt4-EDQrvekIQspSMI4smA2SVcXy9JVfTIKwa6tLormiRF9CqJ7jKrRvgAkAtNIs2-b2dvJr3FXpkBwCEKDck1RGKoycPBtlXet-neGLcsuedzBN9zGZdGKVhKUz0wjIfxn5d9d"
  }
];

export default function Services({ onOpenVIPModal }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-background text-on-surface font-body-md antialiased">
      
      {/* Services Hero Section */}
      <section className="relative h-[614px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ 
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvd294ihGnDG8zjH2_IqUfOO5Ptw-xXvjYubx_Qu_-wWte3JWR4t9MlIBC9KiB57LVYpT361fTsbNVuKgkUsAghBcqLAVDq2qS9i-yS9uuqskQM4ljAz9SGQgagNft_fpAeb4luJrFB0U2abWL3e-RH2jI91fXfhKhXOve_nEbpP5ZTGKGR5qyRuHHm8DU1Oq-bRobOKkBOe3rwAOVuVqWky_RsgH0sxgEMKCUKEw25Txjua2HE7c1suyHqEhd62UY1Do1Fwx0rT1O')` 
            }}
          />
          <div className="absolute inset-0 bg-primary/45 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-4xl text-white">
          <span className="text-gold font-label-bold text-label-sm uppercase tracking-[0.2em] mb-4 block">Our Expertise</span>
          <h1 className="text-white font-display-lg text-[40px] md:text-[56px] font-bold mb-6 leading-tight">Elevating Your Real Estate Experience</h1>
          <p className="text-white/95 font-body-lg text-lg max-w-2xl mx-auto leading-relaxed">
            From strategic investments to finding your dream residence, we provide bespoke advisory services tailored for the discerning property buyer.
          </p>
        </div>
      </section>

      {/* Main Services Section - Modern Grid */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Property Buying & Selling */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col h-full" id="buying-selling">
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-colors duration-500"></div>
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt="Luxury Villa exterior" 
                loading="lazy"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4RQEyvT21Ah3Wvzc8KkRRDlhG8rXV2DaX0sxbjLIzYYupzR2p93DNxLpF_eCCiVS0Tl8HZH3Yi6uUy9il6BR7-2EOlR96OFxueNhvhROAavB46JW1t40sSio5Nc5j4qb64rMZSGM8j5nHcTQCHO17RiGfFfv0wQ80yWoyDHtbNsdwTxMpg7VBjw0_JHpyqYkv_IfbXoYow9_uDoAUKb9bbzyfckrocd4Ev-2VS79MtSLx6fsVlUFAXuFoNdFVoupegZ97i6OzXvn2"
              />
              <div className="absolute bottom-4 left-6 z-20 flex items-center gap-3">
                 <span className="material-symbols-outlined text-white text-3xl p-2 bg-white/20 backdrop-blur-md rounded-lg" style={{ fontVariationSettings: "'FILL' 1" }}>real_estate_agent</span>
                 <h2 className="text-2xl font-bold text-white tracking-wide">Buying & Selling Advisory</h2>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between bg-surface">
              <div>
                <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed">
                  Navigating the real estate market can be complex. Our experts assist you in finding the right property that matches your needs and budget, ensuring a smooth process from start to finish.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-on-surface-variant font-medium text-sm">
                    <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                    <span>Exclusive Off-Market Listings</span>
                  </li>
                  <li className="flex items-center gap-3 text-on-surface-variant font-medium text-sm">
                    <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                    <span>Professional Property Valuations</span>
                  </li>
                  <li className="flex items-center gap-3 text-on-surface-variant font-medium text-sm">
                    <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                    <span>End-to-End Legal Assistance</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center gap-4 flex-wrap mt-auto">
                <Link 
                  className="inline-flex items-center gap-2 text-primary font-label-bold text-label-sm group-hover:text-secondary transition-all uppercase tracking-wider font-bold w-fit" 
                  to="/services/property-buying-selling"
                >
                  VIEW METHODOLOGY <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </Link>
                <Link 
                  className="text-xs text-on-surface-variant hover:text-primary transition-colors underline font-medium"
                  to="/properties"
                >
                  Browse Listings
                </Link>
              </div>
            </div>
          </div>

          {/* Investment Consultation */}
          <div className="bg-primary border border-primary-container rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col h-full relative" id="investment">
            <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-[150px]">trending_up</span>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between relative z-10">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined text-[#C5A059] text-4xl p-3 bg-white/10 backdrop-blur-md rounded-xl">finance_chip</span>
                  <h2 className="text-2xl font-bold text-[#C5A059] tracking-wide">Investment & Mandate Advisory</h2>
                </div>
                <p className="font-body-md text-white/80 mb-6 leading-relaxed">
                  Maximize your returns with our strategic investment advice. We analyze market trends, identify lucrative opportunities, and provide personalized investment plans to help you build and grow your real estate portfolio.
                </p>
              </div>
              <Link 
                className="inline-flex items-center gap-2 bg-[#C5A059] text-primary px-6 py-3 rounded-lg font-label-bold text-label-sm hover:bg-white hover:text-primary transition-all uppercase tracking-wider font-bold w-fit mt-auto shadow-md" 
                to="/services/investment-consultation"
              >
                VIEW ANALYSIS <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Market Analysis */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col h-full" id="market-analysis">
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl p-3 bg-primary/5 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">insights</span>
                  <h3 className="text-2xl font-bold text-primary tracking-wide">Market Analysis & Feasibility</h3>
                </div>
                <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
                  Stay informed with our comprehensive market analysis reports. We provide insights into current market conditions, valuations, and future infrastructure trends.
                </p>
              </div>
              <Link 
                className="inline-flex items-center gap-2 text-primary font-label-bold text-label-sm group-hover:text-secondary transition-all uppercase tracking-wider font-bold w-fit mt-auto" 
                to="/services/market-analysis"
              >
                Learn More <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Home Loan Made Easy */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col h-full" id="home-loan">
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl p-3 bg-primary/5 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">account_balance</span>
                  <h3 className="text-2xl font-bold text-primary tracking-wide">Home Loan & Financing</h3>
                </div>
                <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
                  Flexible financing options tailored to your needs. Enjoy attractive interest rates, easy EMIs, quick approvals, and minimal paperwork through India's premier partner banks.
                </p>
              </div>
              <Link 
                className="inline-flex items-center gap-2 text-primary font-label-bold text-label-sm group-hover:text-secondary transition-all uppercase tracking-wider font-bold w-fit mt-auto" 
                to="/home-loan"
              >
                Calculate EMI & Apply <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* Testimonial Section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low border-b border-outline-variant/30">
        <div className="max-w-4xl mx-auto text-center">
          <span className="material-symbols-outlined text-secondary text-5xl mb-6">format_quote</span>
          <h2 className="text-3xl font-bold text-primary mb-8">What Our Clients Are Saying</h2>
          
          <div className="relative overflow-hidden p-8 md:p-12 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm min-h-[300px] flex flex-col justify-center">
            {/* Active Testimonial Card */}
            <div className="transition-all duration-500 ease-in-out">
              <p className="font-headline-sm text-lg md:text-xl italic text-on-surface-variant mb-8 leading-relaxed max-w-2xl mx-auto">
                "{TESTIMONIALS[activeIndex].quote}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img 
                  className="w-16 h-16 rounded-full object-cover" 
                  alt={TESTIMONIALS[activeIndex].name} 
                  src={TESTIMONIALS[activeIndex].image}
                />
                <div className="text-left">
                  <p className="font-label-bold text-label-sm text-primary font-bold">{TESTIMONIALS[activeIndex].name}</p>
                  <p className="font-label-sm text-xs text-on-surface-variant mt-0.5">{TESTIMONIALS[activeIndex].role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border-none cursor-pointer ${index === activeIndex ? 'bg-primary w-6' : 'bg-outline-variant/60 hover:bg-outline-variant'}`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Action Booking strategic consult */}
      <section className="py-20 text-center bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="text-[32px] font-bold text-primary mb-4 font-display-lg">
            Ready to Take the Next Step?
          </h2>
          <p className="text-lg text-on-surface-variant max-w-[620px] mx-auto mb-8 leading-relaxed">
            Schedule a private, zero-obligation advisory session with our senior consultants today.
          </p>
          <button 
            onClick={onOpenVIPModal} 
            className="bg-primary text-white px-6 py-3.5 rounded-lg font-label-bold text-label-sm uppercase tracking-widest hover:bg-primary-container transition-colors shadow-md border-none cursor-pointer"
          >
            Schedule Free Consultation
          </button>
        </div>
      </section>

    </div>
  );
}
