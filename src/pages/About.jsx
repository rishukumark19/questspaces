import React from 'react';
import heroImg from '../assets/about_hero.png';

export default function About({ onOpenVIPModal }) {
  return (
    <div className="bg-background text-on-background font-body-md">
      
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div
            className="bg-cover bg-center w-full h-full"
            style={{
              backgroundImage: `url(${heroImg})`
            }}
          />
          <div className="absolute inset-0 bg-primary/40" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center text-white">
          <span className="text-label-sm font-semibold uppercase tracking-[0.2em] mb-4 block opacity-85">
            Our Story
          </span>
          <h1 className="text-[40px] md:text-[64px] font-bold leading-tight">
            The Quest for Better Spaces
          </h1>
        </div>
      </section>

      {/* Mission & Vision Split Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 my-10">
        {/* Main Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <span className="text-label-sm font-semibold uppercase tracking-[0.2em] mb-2 block text-secondary">
              Who We Are
            </span>
            <h2 className="text-[32px] font-semibold text-primary mb-6">
              About Quest Spaces
            </h2>
            <div className="flex flex-col gap-6">
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Welcome to <strong>Quest Spaces Pvt. Ltd.</strong>, a trusted real estate advisory crafted for discerning buyers and investors. We specialise in guiding clients through every stage of their property journey and help make confident, value-driven decisions.
              </p>
              
              <p className="text-base text-on-surface-variant leading-relaxed">
                We believe that finding the perfect property is more than just a transaction — it’s a journey. Backed by over 12 years of deep real estate expertise and advisory leadership, our mission has been to simplify the home search process and provide unparalleled support to our clients.
              </p>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-[450px] rounded-lg overflow-hidden shadow-sm">
            <img
              className="object-cover w-full h-full"
              alt="Architectural model of contemporary design"
              loading="lazy"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8fxZFpDWvdp-GIzlQXWU11J9g7ROACX3IEQVbeJcTpt05OOjxPwHq4oAUtmozNQM1zaPpEQ-n6znLar-kfo-2jIfDE7BbKZ1mQ5dWd4QmONVsp2uddwV1WiRX9quLU8I-jMlk988a3O3Wp72EnT9wT_8g2bnF6jzXAOkshietCheOYFQp-DbBjw7FctOnfLulE-ItwlFSBqJSVNd7pafzx-qN2jQnh8FaE2e8hat916cLoEr71Xh9NAN0VqJz36nWzyFUIM3cQJ3R"
            />
          </div>
        </div>

        {/* Mission & Vision Cards (Below Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4 text-secondary">
              <span className="material-symbols-outlined text-3xl">target</span>
              <h4 className="font-semibold text-primary text-xl">Our Mission</h4>
            </div>
            <p className="text-base text-on-surface-variant leading-relaxed font-body-md">
              To empower individuals and families to make informed and confident real estate decisions through expert guidance, integrity, and personalized service.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4 text-secondary">
              <span className="material-symbols-outlined text-3xl">visibility</span>
              <h4 className="font-semibold text-primary text-xl">Our Vision</h4>
            </div>
            <p className="text-base text-on-surface-variant leading-relaxed font-body-md">
              To become the most trusted real estate advisory firm, setting new benchmarks in transparency, innovation, and client experience — while transforming aspirations into enduring value across Bengaluru and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 my-10 border-t border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-[32px] font-semibold text-primary font-display-lg">
              Vivek Anand
            </h2>
            <p className="text-label-sm text-secondary font-semibold uppercase tracking-widest -mt-4">
              Founder
            </p>
            <div className="flex flex-col gap-4 text-on-surface-variant font-body-md text-base leading-relaxed">
              <p className="italic border-l-2 border-secondary pl-4 text-lg text-primary font-medium">
                "Every property search is more than just a transaction — it’s a journey."
              </p>
              <p>
                Vivek founded the company in 2024 with a clear vision — to redefine the way people experience real estate. With over 12 years of extensive experience in the industry, he brings deep market knowledge, strategic insight, and a client-first approach to every engagement.
              </p>
              <p>
                This philosophy drives the company’s commitment to understanding client needs, offering transparent advice, and delivering long-term value rather than short-term deals.
              </p>
              <p>
                His expertise spans commercial and residential leasing, market analysis and feasibility studies, strategic negotiation, mandates, and investment advisory. Known for his analytical approach and negotiation acumen, he has successfully guided clients through complex real estate decisions with clarity and confidence.
              </p>
              <p>
                Under Vivek’s leadership, the company continues to build strong relationships, deliver tailored real estate solutions, and create meaningful outcomes for clients across the real estate spectrum.
              </p>
            </div>
          </div>
          <div className="relative h-[600px] rounded-xl overflow-hidden shadow-sm">
            <img
              alt="Vivek Anand, Founder of Quest Spaces"
              className="w-full h-full object-cover"
              loading="lazy"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhT6os7vhKVIVWCqR5pZKWpLcfp17WQNZnRc8gfMAS7YALeuEbtZxa0PQhdBjJjmDQCKDiScvdch3DNvUUzchjHQKp2HpLdNzag-32SgU_swPZgIz9JaYj7NuaO3UsvWZppEYn7eMsXAfzIrrudyOYLZGV8oftYKO5gsWRX7ba7oGlbC6GAkmGwH7SXy-VkvEjUWvDwe5J_RU3MpS1ShD8ka2J-XV9T-1lRrmRWPKz-UaEzOdyDU4J"
            />
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-surface-container-low border-y border-outline-variant/30 overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <span className="text-gold font-label-bold text-label-sm uppercase tracking-[0.2em] block">Our Core Pillars</span>
            <h2 className="font-display-lg text-[32px] font-bold mt-4 text-primary">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col items-start md:col-span-2">
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl">gavel</span>
              <h3 className="text-xl font-semibold text-primary mb-2">Integrity and Transparency</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Upholding honesty, clear communication and ethical advisory in every engagement — because trust is the foundation of lasting relationships.
              </p>
            </div>
            
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col items-start md:col-span-2">
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl">workspace_premium</span>
              <h3 className="text-xl font-semibold text-primary mb-2">Excellence in Advisory</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Delivering thoughtful, research-backed guidance with the highest standards of professionalism, precision, and execution.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col items-start md:col-span-2">
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl">favorite</span>
              <h3 className="text-xl font-semibold text-primary mb-2">Client-First Commitment</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Every recommendation begins with our clients’ best interests — tailored solutions, personalized attention, and long-term value creation.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col items-start md:col-span-3">
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl">lightbulb</span>
              <h3 className="text-xl font-semibold text-primary mb-2">Innovation</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Leveraging market insights, technology, and evolving trends to offer smarter, forward-looking real estate strategies.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col items-start md:col-span-3">
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl">lock</span>
              <h3 className="text-xl font-semibold text-primary mb-2">Discretion</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Respecting privacy and confidentiality at every stage of the advisory process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Quest Spaces Section */}
      <section className="py-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <span className="text-gold font-label-bold text-label-sm uppercase tracking-[0.2em] block">Why Choose Us</span>
          <h2 className="font-display-lg text-[32px] font-bold mt-4 text-primary">Why Quest Spaces</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface p-6 rounded-xl border border-outline-variant/20 shadow-sm">
            <span className="material-symbols-outlined text-secondary text-3xl mb-4">military_tech</span>
            <h3 className="text-lg font-semibold text-primary mb-2">Strategic Expertise</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Insight-led advisory backed by deep market intelligence.
            </p>
          </div>
          
          <div className="bg-surface p-6 rounded-xl border border-outline-variant/20 shadow-sm">
            <span className="material-symbols-outlined text-secondary text-3xl mb-4">room_preferences</span>
            <h3 className="text-lg font-semibold text-primary mb-2">Bespoke Advisory</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Tailored strategies aligned to your goals.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-outline-variant/20 shadow-sm">
            <span className="material-symbols-outlined text-secondary text-3xl mb-4">hub</span>
            <h3 className="text-lg font-semibold text-primary mb-2">Trusted Ecosystem</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Strong partnerships ensuring seamless execution.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-outline-variant/20 shadow-sm">
            <span className="material-symbols-outlined text-secondary text-3xl mb-4">visibility</span>
            <h3 className="text-lg font-semibold text-primary mb-2">Transparent by Design</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Clear processes. Honest communication. Total clarity.
            </p>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-20 bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <span className="text-gold font-label-bold text-label-sm uppercase tracking-[0.2em] block">Our Process</span>
            <h2 className="font-display-lg text-[32px] font-bold mt-4 text-primary">How We Work</h2>
            <p className="text-on-surface-variant text-base mt-2">End-to-End Assistance throughout your real estate lifecycle.</p>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              
              <div className="bg-background p-6 rounded-xl border border-outline-variant/30 text-center flex flex-col items-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-4">1</div>
                <h4 className="font-semibold text-primary text-sm mb-1">Explore Properties</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Discover pre-vetted premium assets matching your tastes.</p>
              </div>

              <div className="bg-background p-6 rounded-xl border border-outline-variant/30 text-center flex flex-col items-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-4">2</div>
                <h4 className="font-semibold text-primary text-sm mb-1">Expert Consultation</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Get detailed micro-market insights and options analysis.</p>
              </div>

              <div className="bg-background p-6 rounded-xl border border-outline-variant/30 text-center flex flex-col items-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-4">3</div>
                <h4 className="font-semibold text-primary text-sm mb-1">Guided Site Visit</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Conduct personal or virtual site walkthroughs with advisors.</p>
              </div>

              <div className="bg-background p-6 rounded-xl border border-outline-variant/30 text-center flex flex-col items-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-4">4</div>
                <h4 className="font-semibold text-primary text-sm mb-1">Secure Your Property</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Navigate high-stakes commercial terms negotiation smoothly.</p>
              </div>

              <div className="bg-background p-6 rounded-xl border border-outline-variant/30 text-center flex flex-col items-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-4">5</div>
                <h4 className="font-semibold text-primary text-sm mb-1">Loan & Documentation</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Legal vetting, document handling, and customized banking advisory.</p>
              </div>

              <div className="bg-background p-6 rounded-xl border border-outline-variant/30 text-center flex flex-col items-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-4">6</div>
                <h4 className="font-semibold text-primary text-sm mb-1">Dedicated Support</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Post-sales assistance for long-term values management.</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 bg-background border-t border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <span className="text-gold font-label-bold text-label-sm uppercase tracking-[0.2em] block">Our Leadership</span>
            <h2 className="font-display-lg text-[32px] font-bold mt-4 text-primary">Meet the Advisory Team</h2>
            <p className="text-on-surface-variant text-base mt-2 max-w-2xl mx-auto">Backed by decades of collective experience across Bengaluru's premium micro-markets.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop" 
                  alt="Arjun Kapoor"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                />
              </div>
              <div className="p-6 text-center border-t border-outline-variant/20">
                <h3 className="font-bold text-lg text-primary mb-1">Arjun Kapoor</h3>
                <p className="text-secondary text-xs uppercase tracking-widest font-bold mb-3">Head of Residential Sales</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">Specializing in ultra-luxury villas and branded residences across North Bengaluru.</p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" 
                  alt="Priya Desai"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                />
              </div>
              <div className="p-6 text-center border-t border-outline-variant/20">
                <h3 className="font-bold text-lg text-primary mb-1">Priya Desai</h3>
                <p className="text-secondary text-xs uppercase tracking-widest font-bold mb-3">Commercial Director</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">Expert in Grade-A office spaces, yielding assets, and institutional leasing.</p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop" 
                  alt="Rahul Verma"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                />
              </div>
              <div className="p-6 text-center border-t border-outline-variant/20">
                <h3 className="font-bold text-lg text-primary mb-1">Rahul Verma</h3>
                <p className="text-secondary text-xs uppercase tracking-widest font-bold mb-3">Legal & Compliance Lead</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">Ensuring airtight RERA compliance, title diligence, and secure transactions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action CTA */}
      <section className="py-20 bg-surface text-center border-t border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="text-[32px] font-semibold text-primary mb-4 font-display-lg">
            Speak Directly with Our Advisory Team
          </h2>
          <p className="text-lg text-on-surface-variant max-w-[620px] mx-auto mb-8 leading-relaxed font-body-md">
            Schedule a private, non-obligatory strategic session with Vivek Anand or our senior advisors.
          </p>
          <button 
            onClick={onOpenVIPModal} 
            className="bg-primary text-white px-6 py-3.5 rounded-lg font-label-bold text-label-sm uppercase tracking-widest hover:bg-primary-container transition-colors shadow-md border-none cursor-pointer"
          >
            Book Founder Consultation
          </button>
        </div>
      </section>

    </div>
  );
}
